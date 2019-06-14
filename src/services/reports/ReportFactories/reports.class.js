const customerTemplate = () => {
  return {
    'header': false,
    'title': '',
    'custAddr': false,
    'name': '',
    'streetAddress': '',
    'city': '',
    'prodTable': false,
    'Product': [],
    'totalCost': '',
    'includeDonation': false,
    'Donation': '',
    'GrandTotal': '',
    'DonationThanks': [],
    'specialInfo': []
  };
};
module.exports = class reportsService {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;

  }

  customerTemplate() {
    return customerTemplate();
  }

  async customerOptions(where = {}) {
    const seqClient = this.app.get('sequelizeClient');
    const categories = seqClient.models['categories'];
    const orderedProducts = seqClient.models['ordered_products'];
    const orders = seqClient.models['orders'];
    const products = seqClient.models['products'];

    const year = seqClient.models['year'];


    return {
      where: where,
      include: [{
        model: orders,
        include: {
          model: orderedProducts,
          as: 'orderedProducts',
          include: {model: products, as: 'products', include: {model: categories}}
        }
      }, {model: year}]
    };
  }

  emptyReturn() {
    return {

      'customerYear': [],
      totalCost: 0.0,
      totalQuantity: 0
    };
  }

  async getCustomerYears(customers, inputs) {
    let customerYrs = [];
    let tCostT = 0.0;
    let quantityT = 0;
    inputs.categories_grouped = await this.groupCategories(inputs.categories, customers[0].year_id, true);
    for (const cust of customers) {
      let custYr = await this.generateCustomerPage(cust.dataValues, inputs);
      if (custYr.tQuant > 0) {
        tCostT += custYr.tCost;
        quantityT += custYr.tQuant;
        customerYrs.push(custYr.data);
      }
    }
    return {totalCost: tCostT, quantityT: quantityT, customerYears: customerYrs};
  }

  async generateCustomerObjects(inputs) {
    const seqClient = this.app.get('sequelizeClient');
    const customersModel = seqClient.models['customers'];
    const {

      customers,
    } = inputs;
    let customersGen = [];
    for (const cust of customers) {
      let custM;
      let where = await this.getGeneralFilter('id', cust, inputs);
      let options = await this.customerOptions(where);
      custM = await customersModel.findOne(options);
      if (custM) {
        customersGen.push(custM);
      }
    }
    return customersGen;
  }
  async getGeneralFilter(idkey, id, inputs) {
    const {
      user,
      includeSubUsers,
      selectedYear,
    } = inputs;
    let where = {[idkey]: id, user_id: user};
    if (includeSubUsers) {
      where = {[idkey]: id, user_id: await this.returnManagedUserFilter(user, selectedYear)};
    }
    return where;
  }
  async returnManagedUserFilter(user, year) {
    const sequelize = this.app.get('sequelizeClient');
    const user_manager = sequelize.models['user_manager'];

    const uM = await user_manager.findAll({
      where: {manage_id: user, year_id: year}

    });
    if (uM) {
      let userIds = [];
      for (const manageEntry of uM) {
        userIds.push(manageEntry.user_id);
      }
      return {'$in': userIds};


    }
    return user;

  }


  async generateProductTable(orderArray, category) {

    let data = {
      Product: [],
      totalCost: 0.0,
      totalQuantity: 0
    };
    let tCost = 0.0;
    let quantityT = 0;
    for (const op of orderArray) {
      if ((op.products.category && op.products.category.category_name === category) || category === 'All') {
        let product = {
          'ID': op.products.human_product_id,
          'Name': op.products.product_name,
          'Size': op.products.unit_size,
          'UnitCost': op.products.unit_cost,
          'Quantity': op.quantity,
          'TotalCost': op.extended_cost
        };
        tCost += op.extended_cost;
        quantityT += op.quantity;
        data.Product.push(product);
      }
    }
    data.totalCost = tCost;


    data.totalQuantity = quantityT;


    return data;

  }

  async getCategory(year, category, includeHeader) {
    const seqClient = this.app.get('sequelizeClient');
    const categories = seqClient.models['categories'];

    let cat;
    if (includeHeader) {
      cat = await categories.findOne({
        where: {
          category_name: category,
          year_id: year
        }
      });
    }
    return cat;
  }

  getSpecialInfos (inputs, delivery_date) {
    const {
      category,
      includeHeader,
    } = inputs;
    let specialInfo = [];
    if (includeHeader && category !== 'All' && delivery_date) {

      specialInfo.push({text: '*Notice: These products will be delivered to your house on ' + delivery_date + ('.')});

    }
    return specialInfo;
  }

  getPaymentInfo(cust, tCost) {
    let specialInfo = [];
    specialInfo.push({text: 'Total paid to date: $' + cust.order.amount_paid + ' out of $' + tCost + ' due total. See Individual Delivery tables for specific payment requirements.'});
    return specialInfo;

  }

  getDonationFields(custYr, donation) {
    if (donation > 0) {
      custYr.DonationThanks.push({text: 'Thank you for your $' + donation + ' donation '});
      custYr.includeDonation = true;
      custYr.Donation = donation;
      custYr.GrandTotal = custYr.totalCost + donation;
    }
    return custYr;
  }

  getCustomerMetaFields(cust, custYr) {
    custYr.name = cust.customer_name;
    custYr.streetAddress = cust.street_address;
    custYr.city = cust.city + ' ' + cust.state + ', ' + cust.zip_code;
    custYr.header = true;
    custYr.title = cust.customer_name + ' ' + cust.year.year + ' Order';


    return custYr;
  }

  async getCustomerProductData(cust, category) {
    let orderArray = cust.order.orderedProducts;

    let pTable = await this.generateProductTable(orderArray, category);
    let tCost = pTable.totalCost;
    let custYr = {};
    custYr.Product = pTable.Product;
    //quantityT += pTable.totalQuantity;
    custYr.totalCost = tCost;
    return {tCost: tCost, tQuant: pTable.totalQuantity, data: custYr};

  }

  calculateCustomerTotalQuantity(category, cust) {
    let orderArray = cust.order.orderedProducts;
    const totalQuantity = orderArray.reduce((a, b) => {
      if (b.products.category.category_name === category || category == 'ALL') {
        return a + b.quantity;
      } else {return a;}
    }, 0);
    return totalQuantity;
  }

  doesCustomerHaveProducts(cust, category) {
    if (!cust.order) {
      return false;
    }
    if (!cust.order.orderedProducts) {
      return false;
    }

    let totalQuantity = this.calculateCustomerTotalQuantity(category, cust);
    return (totalQuantity > 0);
  }

  async groupCategories(categories, year, includeHeader) {
    if (categories.includes('All')) {
      return new Map();
    }
    let groups = new Map();
    for (const category of categories) {
      let cat = await this.getCategory(year, category, includeHeader);
      let catDate = cat.delivery_date.toLocaleDateString();
      if (groups.has(catDate)) {
        let dateVals = groups.get(catDate);
        dateVals.push(cat.category_name);
        groups.set(catDate, dateVals);
      } else {
        groups.set(catDate, [cat.category_name]);

      }
    }
    return groups;
  }

  generateTable(tCost, tQuant, data) {
    let table = {
      Product: [],
      totalCost: 0.0,
      totalQuantity: 0
    };
    table.Product = table.Product.concat(data.Product);
    table.totalQuantity += tQuant;
    table.totalCost += data.totalCost;
    return table;
  }

  async generateCustomerPageAllCategory(cust, inputs, custYr) {
    let productTables = [];
    let retTCost = 0;
    let retTQuant = 0;

    const category = inputs.category;

    let {tCost, tQuant, data} = await this.getCustomerProductData(cust, category);
    let table = this.generateTable(tCost, tQuant, data);
    retTCost += tCost;
    retTQuant += tQuant;


    if (table.totalQuantity > 0) {
      productTables.push(table);
    }
    custYr = this.getDonationFields(custYr, cust.donation);
    custYr.specialInfoBottom = this.getPaymentInfo(cust, retTCost);
    custYr.prodTable = productTables;
    custYr.TotalCost = retTCost;
    custYr.TotalQuantity = retTQuant;
    custYr.GrandTotal = cust.donation + retTCost;
    return {tCost: retTCost, tQuant: retTQuant, data: custYr};
  }

  async generateDateGroupTable(cust, inputs, date, categories) {
    let table = {
      Product: [],
      totalCost: 0.0,
      totalQuantity: 0
    };
    let retTCost = 0;
    let retTQuant = 0;
    table.specialInfoTop = this.getSpecialInfos(inputs, date);

    for (const category of categories) {
      if (this.doesCustomerHaveProducts(cust, category)) {
        let {tCost, tQuant, data} = await this.getCustomerProductData(cust, category);
        table.Product = table.Product.concat(data.Product);
        table.totalQuantity += tQuant;
        table.totalCost += data.totalCost;
        retTCost += tCost;
        retTQuant += tQuant;
      }
    }

    return {tCost: retTCost, tQuant: retTQuant, table: table};
  }

  async loopCategories(inputs, cust) {
    let productTables = [];
    let retTCost = 0;
    let retTQuant = 0;
    for (const [date, categories] of inputs.categories_grouped) {
      let {tCost, tQuant, table} = await this.generateDateGroupTable(cust, inputs, date, categories);
      retTCost += tCost;
      retTQuant += tQuant;
      if (table.totalQuantity > 0) {
        productTables.push(table);
      }

    }
    return {tCost: retTCost, tQuant: retTQuant, productTables: productTables};

  }

  async generateCustomerPageWithCategory(cust, inputs, custYr){
    let {tCost, tQuant, productTables} = await this.loopCategories(inputs, cust);
    custYr = this.getDonationFields(custYr, cust.donation);
    custYr.specialInfoBottom = this.getPaymentInfo(cust, tCost);
    custYr.prodTable = productTables;
    custYr.TotalCost = tCost;
    custYr.TotalQuantity = tQuant;
    custYr.GrandTotal = cust.donation + tCost;
    return {tCost: tCost, tQuant: tQuant, data: custYr};
  }

  async generateCustomerPage(cust, inputs, header = true) {
    let custYr = this.customerTemplate();
    custYr.custAddr = header;
    custYr = this.getCustomerMetaFields(cust, custYr);
    if (inputs.category === 'All') {
      return await this.generateCustomerPageAllCategory(cust, inputs, custYr);

    } else {
      return await this.generateCustomerPageWithCategory(cust, inputs, custYr);

    }

  }

};
