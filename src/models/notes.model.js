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

  note: {
    type: DataTypes.TEXT,
    allowNull: false
  },




};
module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const schema = sequelizeClient.define('notes', defintion, {
    tableName: 'notes', underscored: true,
  });
  schema.associate = models => {
    schema.belongsTo(models.year, {onDelete: 'cascade'});
    schema.belongsTo(models.user, {onDelete: 'cascade'});
    schema.belongsTo(models.note_codes, {onDelete: 'cascade'});
    schema.belongsTo(models.customers, {onDelete: 'cascade'});

  };
  return schema;
};
