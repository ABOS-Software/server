const reportsService = require('./reports.class');

class SplitReports extends reportsService {
  constructor(options, app) {
    super(options, app);
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
    const seqClient = this.app.get('sequelizeClient');
    const customersModel = seqClient.models['customers'];
    const {
      selectedYear,
      user,
      includeSubUsers,
    } = inputs;
    let data = {
      'customerYear': []
    };
    let where = await this.getGeneralFilter('year_id', selectedYear, user, includeSubUsers);

    let customers = await customersModel.findAll(await this.customerOptions(where));
    let {totalCost, quantityT, customerYears} = await this.getCustomerYears(customers, inputs);
    data.customerYear = customerYears;
    data.totalCost = totalCost;
    data.totalQuantity = quantityT;
    return data;
  }


}

module.exports = SplitReports;
