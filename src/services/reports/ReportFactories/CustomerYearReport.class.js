const reportsService = require('./reports.class');

class CustomerYearReport extends reportsService {
  constructor(options, app) {
    super(options, app);
  }

  async generateCustomerObjects(inputs) {
    const seqClient = this.app.get('sequelizeClient');
    const customersModel = seqClient.models['customers'];
    const {
      user,
      includeSubUsers,
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
  async generate(inputs) {
    let data = {
      'customerYear': [],
      reportTitle: '',
    };
    let customersGen = await this.generateCustomerObjects(inputs);
    if (customersGen.length < 1) {
      return this.emptyReturn();
    }
    let {totalCost, quantityT, customerYears} = await this.getCustomerYears(customersGen, inputs);
    data.customerYear = customerYears;
    data.totalCost = totalCost;
    data.totalQuantity = quantityT;

    return data;
  }


}

module.exports = CustomerYearReport;
