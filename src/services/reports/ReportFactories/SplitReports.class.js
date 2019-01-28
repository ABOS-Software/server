const reportsService = require('./reports.class');

class SplitReports extends reportsService {
  constructor(options, app) {
    super(options, app);
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
    let where = await this.getGeneralFilter('year_id', selectedYear, inputs);

    let customers = await customersModel.findAll(await this.customerOptions(where));
    let {totalCost, quantityT, customerYears} = await this.getCustomerYears(customers, inputs);
    data.customerYear = customerYears;
    data.totalCost = totalCost;
    data.totalQuantity = quantityT;
    return data;
  }


}

module.exports = SplitReports;
