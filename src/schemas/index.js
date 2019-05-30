const categoriesCreate = require('./create/categories.schema');
const customersCreate = require('./create/customers.schema');
const groupsCreate = require('./create/groups.schema');
const notesCreate = require('./create/notes.schema');
const paymentsCreate = require('./create/payments.schema');
const reportsCreate = require('./create/Blank-Inactive/reports.schema');
const userCreate = require('./create/user.schema');
const yearCreate = require('./create/year.schema');
const categoriesEdit = require('./edit/categories.schema');
const customersEdit = require('./edit/customers.schema');
const groupsEdit = require('./edit/groups.schema');
const notesEdit = require('./edit/notes.schema');
const paymentsEdit = require('./edit/payments.schema');
const productsMany = require('./edit/products-many.schema');
const userEdit = require('./edit/user.schema');
const userHierarchy = require('./edit/user-hierarchy.schema');

module.exports = {
  categoriesCreate: categoriesCreate,
  customersCreate: customersCreate,
  groupsCreate: groupsCreate,
  notesCreate: notesCreate,
  paymentsCreate: paymentsCreate,
  reportsCreate: reportsCreate,
  userCreate: userCreate,
  yearCreate: yearCreate,
  categoriesEdit: categoriesEdit,
  customersEdit: customersEdit,
  groupsEdit: groupsEdit,
  notesEdit: notesEdit,
  paymentsEdit: paymentsEdit,
  productsMany: productsMany,
  userEdit: userEdit,
  userHierarchy: userHierarchy,
};
