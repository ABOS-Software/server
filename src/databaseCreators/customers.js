const request = require('supertest');
const createCustomers = (app) => {
  return app.service('customers').create({
      'order': {
        'orderedProducts': [
          {
            'products': {
              'id': 1
            },
            'quantity': 1,
            'extendedCost': 40,
            'userName': ''
          },
          {
            'products': {
              'id': 1
            },
            'quantity': 2,
            'extendedCost': 80,
            'userName': ''
          }
        ],
        'cost': 120,
        'quantity': 3,
        'amountPaid': 0,
        'delivered': false
      },
      'year': 1,
      'customerName': 'Test Test',
      'phone': '555-555-5555',
      'custEmail': 'test@example.com',
      'streetAddress': '123 S Broad St',
      'city': 'Philadelphia',
      'state': 'PA',
      'zipCode': '19109',
      'donation': '12.45',
      'user': 1
    });
};

module.exports = {
  createCustomers: createCustomers
};
