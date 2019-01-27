const reportsService = require('./reports.class');

class CustomerYearReport extends reportsService {
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
      customers,
    } = inputs;
    let data = {
      'customerYear': [],
      reportTitle: '',
    };
    let quantityT = 0;
    let tCostT = 0.0;
    let customersGen = [];
    try {
      for (const cust of customers) {
        let custM;
        let where = {id: cust, user_id: user};
        if (includeSubUsers) {
          where = {id: cust, user_id: this.returnManagedUserFilter(user, selectedYear)};

        }
        let options = await this.customerOptions(where);
        custM = await customersModel.findOne(options);
        if (custM) {
          customersGen.push(custM);
        }
      }

      if (customersGen.length < 1) {
        return {
          'customerYear': [],
          totalCost: 0.0,
          totalQuantity: 0,
          reportTitle: '',
        };
      }
      for (const cust of customersGen) {
        let custYr = await this.generateCustomerPage(cust, inputs);
        tCostT += custYr.tCost;
        quantityT += custYr.tQuant;
        data.customerYear.push(custYr.data);
      }
      data.totalCost = tCostT;
      data.totalQuantity = quantityT;
    } catch (e) {
      console.log(e);
    }
    return data;
  }


}

module.exports = CustomerYearReport;
