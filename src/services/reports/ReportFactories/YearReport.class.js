const reportsService = require('./reports.class');

class YearReport extends reportsService {
  constructor(options, app) {
    super(options, app);
  }



  getCategoryWhere(category, cat) {
    let catWhere = {};
    if (category !== 'All' && cat) {
      catWhere = {category_id: cat.id};
    }
    return catWhere;
  }



  async getOrderedProducts(category, inputs) {
    const {
      selectedYear,
      user,
      includeSubUsers,
    } = inputs;
    const seqClient = this.app.get('sequelizeClient');
    const categories = seqClient.models['categories'];
    const orderedProducts = seqClient.models['ordered_products'];
    const products = seqClient.models['products'];
    let cat = await this.getCategory(category, selectedYear, true);
    let catWhere = this.getCategoryWhere(category, cat);
    let where = await this.getGeneralFilter('year_id', selectedYear, inputs);
    return await orderedProducts.findAll({
      where: where,
      attributes: [[seqClient.fn('sum', seqClient.col('ordered_products.quantity')), 'quantity'], [seqClient.fn('sum', seqClient.col('ordered_products.extended_cost')), 'extended_cost']],
      group: 'products.id',
      include: [{model: products, as: 'products', where: catWhere, include: {model: categories}}]
    });
  }

  async generateCustYr(inputs) {
    let custYr = this.customerTemplate();
    custYr.custAddr = false;
    custYr.prodTable = true;
    custYr.header = true;
    if (inputs.category === 'All') {
      let productTables = [];
      let retTCost = 0;
      let retTQuant = 0;
      let table = {
        Product: [],
        totalCost: 0.0,
        totalQuantity: 0
      };
      const category = inputs.category;

      let orderArray = await this.getOrderedProducts(category, inputs);
      let pTable = await this.generateProductTable(orderArray, category);
      let tCost = pTable.totalCost;
      let quantityT = pTable.totalQuantity;
      table.Product = table.Product.concat(pTable.Product);
      table.totalQuantity += quantityT;
      table.totalCost += pTable.totalCost;
      retTCost += tCost;
      retTQuant += quantityT;


      if (table.totalQuantity > 0) {
        productTables.push(table);
      }
      custYr.prodTable = productTables;
      custYr.TotalCost = retTCost;
      custYr.TotalQuantity = retTQuant;
      custYr.GrandTotal = retTCost;
      return custYr;

    } else {
      let productTables = [];
      let retTCost = 0;
      let retTQuant = 0;
      for (const [date, categories] of inputs.categories_grouped) {
        let table = {
          Product: [],
          totalCost: 0.0,
          totalQuantity: 0
        };

        for (const category of categories) {
          let orderArray = await this.getOrderedProducts(category, inputs);
          let pTable = await this.generateProductTable(orderArray, category);
          let tCost = pTable.totalCost;
          let quantityT = pTable.totalQuantity;
          table.Product = table.Product.concat(pTable.Product);
          table.totalQuantity += quantityT;
          table.totalCost += pTable.totalCost;
          retTCost += tCost;
          retTQuant += quantityT;

        }
        if (table.totalQuantity > 0) {
          productTables.push(table);
        }

      }

      custYr.prodTable = productTables;
      custYr.TotalCost = retTCost;
      custYr.TotalQuantity = retTQuant;
      custYr.GrandTotal = retTCost;
      //return {tCost: retTCost, tQuant: retTQuant, data: custYr};

      return custYr;
    }
  }

  async generateData(inputs) {
    const seqClient = this.app.get('sequelizeClient');
    const year = seqClient.models['year'];

    const {
      selectedYear,
      category,
    } = inputs;

    let yr = await year.findByPk(selectedYear);
    inputs.categories_grouped = await this.groupCategories(inputs.categories, yr.id, true);

    let data = {
      'customerYear': [],
      reportTitle: '',
    };
    let custYr = await this.generateCustYr(inputs);
    let tCost = custYr.totalCost;
    let quantityT = custYr.quantityT;
    data.reportTitle = yr.year + ' ' + category + ' Orders';
    data.totalCost = tCost;
    data.totalQuantity = quantityT;
    data.customerYear.push(custYr);

    return data;
  }

  async generate(inputs) {
    return await this.generateData(inputs);
  }


}

module.exports = YearReport;
