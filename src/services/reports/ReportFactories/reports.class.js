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
    for (const cust of customers) {
      let custYr = await this.generateCustomerPage(cust, inputs);
      tCostT += custYr.tCost;
      quantityT += custYr.tQuant;
      customerYrs.push(custYr.data);
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

  async getCategory(cust, inputs) {
    const seqClient = this.app.get('sequelizeClient');
    const categories = seqClient.models['categories'];
    const {
      category,
      includeHeader,
    } = inputs;
    let cat;
    if (includeHeader) {
      cat = await categories.findOne({
        where: {
          category_name: category,
          year_id: cust.year_id
        }
      });
    }
    return cat;
  }

  getSpecialInfos(inputs, cat, cust) {
    const {
      category,
      includeHeader,
    } = inputs;
    let specialInfo = [];
    if (includeHeader && category !== 'All' && cat) {

      specialInfo.push({text: '*Notice: These products will be delivered to your house on ' + cat.delivery_date.toLocaleDateString() + ('. Total paid to date: $' + cust.order.amount_paid)});

    }
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
    custYr.prodTable = true;

    return custYr;
  }

  async getCustomerProductData(cust, custYr, inputs) {
    let orderArray = cust.order.orderedProducts;
    const {
      category,
    } = inputs;
    let pTable = await this.generateProductTable(orderArray, category);
    let tCost = pTable.totalCost;
    custYr.Product = pTable.Product;
    //quantityT += pTable.totalQuantity;
    let donation = cust.donation;
    custYr.totalCost = tCost;
    custYr = this.getDonationFields(custYr, donation);
    return {tCost: tCost + donation, tQuant: pTable.totalQuantity, data: custYr};

  }

  doesCustomerHaveProducts(cust) {
    let orderArray = cust.order.orderedProducts;
    const totalQuantity = orderArray.reduce((a, b) => {
      return a + b.quantity;
    }, 0);
    return (totalQuantity > 0);
  }

  async generateCustomerPage(cust, inputs, header = true) {
    let custYr = this.customerTemplate();
    if (this.doesCustomerHaveProducts(cust)) {
      let cat = await this.getCategory(cust, inputs);
      custYr.custAddr = header;
      custYr = this.getCustomerMetaFields(cust, custYr);
      custYr.specialInfo = this.getSpecialInfos(inputs, cat, cust);
      return this.getCustomerProductData(cust, custYr, inputs);
    }
    return {tCost: 0, tQuant: 0, data: custYr};

  }

};
