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

  async generate(jsonParams) {
    const seqClient = this.app.get('sequelizeClient');

    const year = seqClient.models['year'];

    let formattedAddress = jsonParams.Scout_Town + ', ' + jsonParams.Scout_State + ' ' + jsonParams.Scout_Zip;
    let customers = [];
    if (jsonParams.Customer) {
      if (jsonParams.Customer instanceof Array) {
        for (const it of jsonParams.Customer) {
          customers.push(it);
        }

      } else {
        customers.push(jsonParams.Customer);
      }
    }

    let user = jsonParams.User;
    let Category = jsonParams.Category || 'All';
    let repTitle = '';
    let Splitting = '';
    let fileName = 'report.pdf';
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

    if (!jsonParams.LogoLocation || !jsonParams.LogoLocation.base64) {
      jsonParams.LogoLocation = {base64: ''};
    }
    let data = await this.generateJSON({
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
      repTitle: repTitle,
      splitting: Splitting,
      includeHeader: includeHeader,
    });

    return await {fileName: fileName, data: data };

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

  async generateJSON(inputs) {


    const {
      reportType,
      scoutName,
      scoutStAddr,
      scoutCityLine,
      scoutRank,
      scoutPhone,
      logoLoc,

    } = inputs;

    let data = {
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
      'column': [
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
      ],

    };
    if (reportType === 'customers_split') {
      const splitObject = await this.generateCustomerSplit(inputs);
      data.customerYear = splitObject.customerYear;
      data.info.TotalCost = splitObject.totalCost;
      data.info.TotalQuantity = splitObject.totalQuantity;
    } else if (reportType === 'Customer All-Time Totals') {
      const splitObject = await this.generateCustomerHistorical(inputs);
      data.customerYear = splitObject.customerYear;
      data.info.TotalCost = splitObject.totalCost;
      data.info.TotalQuantity = splitObject.totalQuantity;
    } else if (reportType === 'Year Totals') {
      const splitObject = await this.generateYearTotals(inputs);
      data.customerYear = splitObject.customerYear;
      data.info.TotalCost = splitObject.totalCost;
      data.info.TotalQuantity = splitObject.totalQuantity;
      data.info.reportTitle = splitObject.reportTitle;

    } else {
      const splitObject = await this.generateCustomerYear(inputs);
      data.customerYear = splitObject.customerYear;
      data.info.TotalCost = splitObject.totalCost;
      data.info.TotalQuantity = splitObject.totalQuantity;
      data.info.reportTitle = splitObject.reportTitle;

    }


    return data;
  }

  async generateYearTotals(inputs) {
    const seqClient = this.app.get('sequelizeClient');
    const categories = seqClient.models['categories'];
    const customersModel = seqClient.models['customers'];
    const orderedProducts = seqClient.models['ordered_products'];
    const orders = seqClient.models['orders'];
    const products = seqClient.models['products'];
    const year = seqClient.models['year'];
    const {
      selectedYear,
      category,
      user,
      includeSubUsers,
      customers,
    } = inputs;
    let data = {
      'customerYear': [],
      reportTitle: '',
    };
    let orderArray = [];
    let customersGen = [];
    let tCost = 0.0;
    let donation = 0.0;
    let quantityT = 0;
    let custYr = customerTemplate();
    try {
      custYr.prodTable = true;
      let cat = await categories.findOne({
        where: {
          category_name: category,
          year_id: selectedYear
        }
      });
      let catWhere = {};
      if (category !== 'All' && cat) {
        catWhere = {category_id: cat.id};
      }
      for (const cust of customers) {
        const custM = await customersModel.findByPk(cust, await this.customerOptions());
        customersGen.push(custM);
      }
      let where = {year_id: selectedYear, user_id: user};
      if (includeSubUsers) {
        where = {year_id: selectedYear, user_id: await this.returnManagedUserFilter(user, selectedYear)};
      }
      let yr = await year.findByPk(selectedYear);
      custYr.custAddr = false;
      orderArray = await orderedProducts.findAll({
        where: where,
        attributes: [[seqClient.fn('sum', seqClient.col('ordered_products.quantity')), 'quantity'], [seqClient.fn('sum', seqClient.col('ordered_products.extended_cost')), 'extended_cost']],
        group: 'products.id',
        include: [{model: products, as: 'products', where: catWhere, include: {model: categories}}]
      });
      custYr.header = true;
      data.reportTitle = yr.year + ' ' + category + ' Orders';
      let pTable = await this.generateProductTable(orderArray, category);
      tCost = pTable.totalCost;
      custYr.Product = pTable.Product;
      quantityT += pTable.totalQuantity;
      custYr.totalCost = tCost;
      custYr.GrandTotal = tCost + donation;
      data.totalCost = tCost;
      data.totalQuantity = quantityT;
      data.customerYear.push(custYr);
    } catch (e) {
      console.log(e);
    }
    return data;
  }

  async generateCustomerYear(inputs) {
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

  async generateCustomerHistorical(inputs) {
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
        return {

          'customerYear': [],
          totalCost: 0.0,
          totalQuantity: 0
        };
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

  async generateCustomerPage(cust, inputs, header = true) {
    const seqClient = this.app.get('sequelizeClient');
    const categories = seqClient.models['categories'];
    let tCost = 0.0;
    let donation = 0.0;
    let custYr = customerTemplate();
    let orderArray = cust.order.orderedProducts;
    const {

      category,


      includeHeader,
    } = inputs;
    const totalQuantity = orderArray.reduce((a, b) => {
        return a + b.quantity;
      }
      , 0);
    if (totalQuantity > 0) {
      let cat;
      if (includeHeader) {
        cat = await categories.findOne({
          where: {
            category_name: category,
            year_id: cust.year_id
          }
        });
      }
      custYr.custAddr = header;
      custYr.name = cust.customer_name;
      custYr.streetAddress = cust.street_address;
      custYr.city = cust.city + ' ' + cust.state + ', ' + cust.zip_code;
      custYr.header = true;
      custYr.title = cust.customer_name + ' ' + cust.year.year + ' Order';

      if (includeHeader && category !== 'All' && cat) {

        custYr.specialInfo.push({text: '*Notice: These products will be delivered to your house on ' + cat.delivery_date.toLocaleDateString() + ('. Total paid to date: $' + cust.order.amount_paid)});

      }
      custYr.prodTable = true;

      let pTable = await this.generateProductTable(orderArray, category);
      tCost = pTable.totalCost;
      custYr.Product = pTable.Product;
      //quantityT += pTable.totalQuantity;
      custYr.totalCost = tCost;
      donation = cust.donation;
      if (donation > 0) {
        custYr.DonationThanks.push({text: 'Thank you for your $' + donation + ' donation '});
        custYr.includeDonation = true;
        custYr.Donation = donation;
        custYr.GrandTotal = tCost + donation;
      }

      return {tCost: tCost + donation, tQuant: pTable.totalQuantity, data: custYr};

    }
    return {tCost: 0, tQuant: 0, data: custYr};

    //  tCostT += tCost + donation;


  }

  async generateCustomerSplit(inputs) {
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
};
