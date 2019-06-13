// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const definition = {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },


  status: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

};
module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const schema = sequelizeClient.define('user_year', definition, {
    tableName: 'user_year', underscored: true,
  });
  schema.associate = models => {
    schema.belongsTo(models.year, {onDelete: 'cascade'});
    schema.belongsTo(models.groups, {onDelete: 'cascade'});
    schema.belongsTo(models.user, {onDelete: 'cascade'});

  };
  return schema;
};
