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
    try {

      let where = {year_id: selectedYear, user_id: user};
      if (includeSubUsers) {
        where = {year_id: selectedYear, user_id: await this.returnManagedUserFilter(user, selectedYear)};

      }
      let customers = await customersModel.findAll(await this.customerOptions(where));
      let tCostT = 0.0;
      let quantityT = 0;

      for (const cust of customers) {

        let custYr = await this.generateCustomerPage(cust, inputs);

        tCostT += custYr.tCost;
        quantityT += custYr.tQuant;
        data.customerYear.push(custYr.data);


      }
      data.totalCost = tCostT;
      data.totalQuantity = quantityT;
    } catch (e) {
      console.error(e);
    }

    return data;
  }


}

module.exports = SplitReports;
