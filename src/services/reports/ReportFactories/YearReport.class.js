const reportsService = require('./reports.class');

class YearReport extends reportsService {
  constructor(options, app) {
    super(options, app);
  }

  async getCategory(category, selectedYear) {
    const seqClient = this.app.get('sequelizeClient');
    const categories = seqClient.models['categories'];
    return await categories.findOne({
      where: {
        category_name: category,
        year_id: selectedYear
      }
    });
  }

  getCategoryWhere(category, cat) {
    let catWhere = {};
    if (category !== 'All' && cat) {
      catWhere = {category_id: cat.id};
    }
    return catWhere;
  }



  async getOrderedProducts(inputs) {
    const {
      selectedYear,
      category,
      user,
      includeSubUsers,
    } = inputs;
    const seqClient = this.app.get('sequelizeClient');
    const categories = seqClient.models['categories'];
    const orderedProducts = seqClient.models['ordered_products'];
    const products = seqClient.models['products'];
    let cat = await this.getCategory(category, selectedYear);
    let catWhere = this.getCategoryWhere(category, cat);
    let where = await this.getGeneralFilter('year_id', selectedYear, user, includeSubUsers);
    return await orderedProducts.findAll({
      where: where,
      attributes: [[seqClient.fn('sum', seqClient.col('ordered_products.quantity')), 'quantity'], [seqClient.fn('sum', seqClient.col('ordered_products.extended_cost')), 'extended_cost']],
      group: 'products.id',
      include: [{model: products, as: 'products', where: catWhere, include: {model: categories}}]
    });
  }

  async generateCustYr(inputs) {
    const {
      category,
    } = inputs;
    let custYr = this.customerTemplate();
    let orderArray = await this.getOrderedProducts(inputs);
    let pTable = await this.generateProductTable(orderArray, category);
    let tCost = pTable.totalCost;
    let quantityT = pTable.totalQuantity;

    custYr.prodTable = true;
    custYr.custAddr = false;
    custYr.header = true;
    custYr.totalCost = tCost;
    custYr.quantityT = quantityT;
    custYr.GrandTotal = tCost;
    custYr.Product = pTable.Product;
    return custYr;
  }

  async generateData(inputs) {
    const seqClient = this.app.get('sequelizeClient');
    const year = seqClient.models['year'];

    const {
      selectedYear,
      category,
    } = inputs;

    let yr = await year.findByPk(selectedYear);
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
