const reportsService = require('./reports.class');

class HistoricalReports extends reportsService {
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

    let customersGen = [];
    try {
      for (const cust of inputs.customers) {
        let custM;
        if (includeSubUsers) {
          custM = await customersModel.findOne({
            where: {id: cust, user_id: await this.returnManagedUserFilter(user, selectedYear)}
          });
        } else {
          custM = await customersModel.findOne({
            where: {id: cust, user_id: user}
          });
        }
        if (custM) {
          customersGen.push(custM);
        }

      }
      if (customersGen.length < 1) {
        return this.emptyReturn();
      }
      let tCostT = 0.0;
      let quantityT = 0;
      for (const customer of customersGen) {
        let header = true;

        let where = {customer_name: customer.customer_name, user_id: user};

        if (includeSubUsers) {
          where = {
            customer_name: customer.customer_name,
            user_id: await this.returnManagedUserFilter(user, selectedYear)
          };

        }
        //  let catWhere = {};
        let options = await this.customerOptions(where);

        let customers = await customersModel.findAll(options);


        for (const cust of customers) {

          let custYr = await this.generateCustomerPage(cust, inputs, header);
          header = false;

          tCostT += custYr.tCost;
          quantityT += custYr.tQuant;
          data.customerYear.push(custYr.data);
        }
      }
      data.totalCost = tCostT;
      data.totalQuantity = quantityT;
    } catch (e) {
      console.error(e);
    }

    return data;
  }


}

module.exports = HistoricalReports;
