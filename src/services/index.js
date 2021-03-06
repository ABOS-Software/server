const categories = require('./categories/categories.service.js');
const customers = require('./customers/customers.service.js');
const groups = require('./groups/groups.service.js');
const orderedProducts = require('./ordered_products/ordered_products.service.js');
const orders = require('./orders/orders.service.js');
const products = require('./products/products.service.js');
const role = require('./role/role.service.js');
const roleHierarchyEntry = require('./role_hierarchy_entry/role_hierarchy_entry.service.js');
const user = require('./user/user.service.js');
const userManager = require('./user_manager/user_manager.service.js');
const userRole = require('./user_role/user_role.service.js');
const userYear = require('./user_year/user_year.service.js');
const year = require('./year/year.service.js');
const userHierarchy = require('./user-hierarchy/user-hierarchy.service.js');
const productsMany = require('./products-many/products-many.service.js');
const reports = require('./reports/reports.service.js');
const payments = require('./payments/payments.service.js');
const paymentMethods = require('./payment_methods/payment_methods.service.js');
const notes = require('./notes/notes.service.js');
const noteCodes = require('./note_codes/note_codes.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(categories);
  app.configure(customers);
  app.configure(groups);
  app.configure(orderedProducts);
  app.configure(orders);
  app.configure(products);
  app.configure(role);
  app.configure(roleHierarchyEntry);
  app.configure(user);
  app.configure(userManager);
  app.configure(userRole);
  app.configure(userYear);
  app.configure(year);
  app.configure(userHierarchy);
  app.configure(productsMany);
  app.configure(reports);
  app.configure(payments);
  app.configure(paymentMethods);
  app.configure(notes);
  app.configure(noteCodes);
};
