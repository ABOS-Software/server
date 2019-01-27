const reportsService = require('./reports.class');

class HistoricalReports extends reportsService {
  constructor(options, app) {
    super(options, app);
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

  async getCustomerYears(customers, inputs, customerYrs) {
    let header = true;

    let tCostT = 0.0;
    let quantityT = 0;
    for (const cust of customers) {
      let custYr = await this.generateCustomerPage(cust, inputs, header);
      header = false;
      tCostT += custYr.tCost;
      quantityT += custYr.tQuant;
      customerYrs.push(custYr.data);
    }
    return {totalCost: tCostT, quantityT: quantityT, customerYears: customerYrs};
  }

  async generateCustomerHistory(customer, inputs, customerYrs) {
    const seqClient = this.app.get('sequelizeClient');
    const customersModel = seqClient.models['customers'];
    let where = await this.getGeneralFilter('customer_name', customer.customer_name, inputs);

    //  let catWhere = {};
    let options = await this.customerOptions(where);

    let customers = await customersModel.findAll(options);

    return await this.getCustomerYears(customers, inputs, customerYrs);


  }

  async generateAllHistories(customers, inputs) {
    let tCostT = 0.0;
    let quantityTR = 0;
    let customerYrs = [];

    for (const customer of customers) {
      let {totalCost, quantityT, customerYears} = await this.generateCustomerHistory(customer, inputs, customerYrs);
      tCostT += totalCost;
      quantityTR += quantityT;
      customerYrs = customerYears;
    }
    return {totalCost: tCostT, quantityT: quantityTR, customerYears: customerYrs};

  }
  async generate(inputs) {
    let data = {
      'customerYear': []
    };
    let customersGen = await this.generateCustomerObjects(inputs);
    if (customersGen.length < 1) {
      return this.emptyReturn();
    }
    let {totalCost, quantityT, customerYears} = await this.generateAllHistories(customersGen, inputs);
    data.customerYear = customerYears;
    data.totalCost = totalCost;
    data.totalQuantity = quantityT;


    return data;
  }


}

module.exports = HistoricalReports;
