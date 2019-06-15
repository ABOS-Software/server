const {yearAttr} = require('../models/attributes');

const getYearWhere = (context) => {
  const sequelize = context.app.get('sequelizeClient');

  const year = sequelize.models['year'];
  let yrInc = {model: year, attributes: yearAttr};
  if (context.params.query.year) {
    yrInc.where = {id: context.params.query.year};

  }
  return yrInc;
};

const yearToId = (context) => {
  if (context.params.query && context.params.query.year) {
    context.params.query.year_id = context.params.query.year;
    delete context.params.query.year;

  }
  return context;
};

module.exports = {
  getYearWhere: getYearWhere,
  yearToId: yearToId
};
