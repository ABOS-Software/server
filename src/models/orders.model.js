// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const defintion = {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  user_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  amount_paid: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },
  delivered: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER(11),
    allowNull: false
  },

  cost: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },

};
module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const schema = sequelizeClient.define('orders', defintion, {
    tableName: 'orders', underscored: true,
  });
  schema.associate = models => {
    schema.belongsTo(models.year, {onDelete: 'cascade'});
    schema.belongsTo(models.user, {onDelete: 'cascade'});

    schema.belongsTo(models.customers, {onDelete: 'cascade'});
    schema.hasMany(models.ordered_products, {as: 'orderedProducts', onDelete: 'cascade'});

  };
  return schema;
};
