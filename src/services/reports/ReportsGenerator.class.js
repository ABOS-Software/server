const {HistoricalReports, CustomerYearReports, SplitReports, YearReport} = require('./ReportFactories/');
const columns = [
  {
    'name': 'ID'
  },
  {
    'name': 'Name'
  },
  {
    'name': 'Unit Size'
  },
  {
    'name': 'Unit Cost'
  },
  {
    'name': 'Quantity'
  },
  {
    'name': 'Extended Price'
  }
];
class ReportsGenerator {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;

  }

  generateDefaultData(inputs) {
    const {
      scoutName,
      scoutStAddr,
      scoutCityLine,
      scoutRank,
      scoutPhone,
      logoLoc,
    } = inputs;

    return {
      'info': {
        'reportTitle': '',
        'logo': logoLoc,
        'name': scoutName,
        'streetAddress': scoutStAddr,
        'city': scoutCityLine,
        'PhoneNumber': scoutPhone,
        'rank': scoutRank,
        'TotalCost': '0',
        'TotalQuantity': '0'
      },
      'splitting': '',
      'column': columns,

    };
  }

  getReportFactory(reportType) {
    let reportClass;

    if (reportType === 'customers_split') {
      reportClass = new SplitReports(this.options, this.app);
    } else if (reportType === 'Customer All-Time Totals') {
      reportClass = new HistoricalReports(this.options, this.app);
    } else if (reportType === 'Year Totals') {
      reportClass = new YearReport(this.options, this.app);
    } else {
      reportClass = new CustomerYearReports(this.options, this.app);
    }
    return reportClass;
  }

  async generateJSON(inputs) {
    const {
      reportType,
    } = inputs;

    let data = this.generateDefaultData(inputs);
    let reportClass = this.getReportFactory(reportType);


    const splitObject = await reportClass.generate(inputs);

    data.customerYear = splitObject.customerYear;
    data.info.TotalCost = splitObject.totalCost;
    data.info.TotalQuantity = splitObject.totalQuantity;
    data.info.reportTitle = splitObject.reportTitle;


    return data;
  }

  async getTemplateMetaData(jsonParams) {
    const seqClient = this.app.get('sequelizeClient');
    const year = seqClient.models['year'];

    let Splitting = '';
    let fileName = 'report.pdf';
    let Category = jsonParams.Category || 'All';
    let yearObj = await year.findByPk(jsonParams.Year);
    let yearText = yearObj.year;
    let includeHeader = jsonParams.Print_Due_Header;

    switch (jsonParams.template) {
      case 'customers_split':
        Splitting = '';
        fileName = yearText + '_customer_orders_' + Category + '.pdf';
        break;

      case 'Year Totals':
        Splitting = '';
        fileName = yearText + '_Total_Orders_' + Category + '.pdf';

        break;

      case 'Customer Year Totals':

        Splitting = '';
        fileName = 'Individual_' + yearText + '_Order_' + Category + '.pdf';

        break;

      case 'Customer All-Time Totals':
        Splitting = 'Year:';
        fileName = 'Individual_historical_orders.pdf';
        Category = 'All';
        includeHeader = false;
        break;
    }
    return {splitting: Splitting, fileName: fileName, Category: Category, includeHeader: includeHeader};
  }

  getCustomersArray(jsonParams) {
    if (!jsonParams.Customer) {
      return [];

    }
    if (jsonParams.Customer instanceof Array) {
      return jsonParams.Customer;
    } else {
      return [jsonParams.Customer];
    }
  }

  setLogoLocation(jsonParams) {
    if (!jsonParams.LogoLocation || !jsonParams.LogoLocation.base64) {
      jsonParams.LogoLocation = {base64: ''};
    }
    return jsonParams;
  }

  async generate(jsonParams) {

    let customers = this.getCustomersArray(jsonParams);
    let user = jsonParams.User;
    let {Splitting, fileName, Category, includeHeader} = await this.getTemplateMetaData(jsonParams);
    let formattedAddress = jsonParams.Scout_Town + ', ' + jsonParams.Scout_State + ' ' + jsonParams.Scout_Zip;

    jsonParams = this.setLogoLocation(jsonParams);
    let options = {
      reportType: jsonParams.template,
      selectedYear: jsonParams.Year,
      scoutName: jsonParams.Scout_name,
      scoutStAddr: jsonParams.Scout_address,
      scoutCityLine: formattedAddress,
      scoutRank: jsonParams.Scout_Rank,
      scoutPhone: jsonParams.Scout_Phone,
      logoLoc: jsonParams.LogoLocation.base64,
      category: Category,
      customers: customers,
      user: user,
      includeSubUsers: jsonParams.Include_Sub_Users,
      repTitle: '',
      splitting: Splitting,
      includeHeader: includeHeader,
    };

    let data = await this.generateJSON(options);

    return await {fileName: fileName, data: data};

  }
}

module.exports = ReportsGenerator;
