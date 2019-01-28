const reportsService = require('./reports.class');

class CustomerYearReport extends reportsService {
  constructor(options, app) {
    super(options, app);
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
