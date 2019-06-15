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

  amount: {
    type: DataTypes.DECIMAL(19, 2),
    allowNull: false
  },

  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },


};
module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const schema = sequelizeClient.define('payments', defintion, {
    tableName: 'payments', underscored: true,
  });
  schema.associate = models => {
    schema.belongsTo(models.year, {onDelete: 'cascade'});
    schema.belongsTo(models.user, {onDelete: 'cascade'});

    schema.belongsTo(models.customers, {onDelete: 'cascade'});
    schema.belongsTo(models.orders, {onDelete: 'cascade'});
    schema.belongsTo(models.payment_methods, {onDelete: 'cascade'});

  };
  return schema;
};
