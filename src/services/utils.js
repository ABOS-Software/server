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

module.exports = {
  getYearWhere: getYearWhere
};
