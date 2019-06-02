const request = require('supertest');

const createOrderC1 = (year) => {
  return {
    'order': {
      'orderedProducts': [
        {
          'products': {
            'id': (1 + year - 1)
          },
          'quantity': 1,
          'extendedCost': 40,
          'userName': ''
        },
        {
          'products': {
            'id': (2 + year - 1)
          },
          'quantity': 2,
          'extendedCost': 20,
          'userName': ''
        }
      ],
      'cost': 60,
      'quantity': 3,
      'amountPaid': 0,
      'delivered': false
    },
    'year': year,
    'customerName': 'Test Test',
    'phone': '555-555-5555',
    'custEmail': 'test@example.com',
    'streetAddress': '123 S Broad St',
    'city': 'Philadelphia',
    'state': 'PA',
    'zipCode': '19109',
    'donation': '12.45',
    'user': 1
  };
};
const createOrderC2 = (year) => {
  return {
    'order': {
      'orderedProducts': [
        {
          'products': {
            'id': (1 + year - 1)
          },
          'quantity': 2,
          'extendedCost': 80,
          'userName': ''
        },
        {
          'products': {
            'id': (2 + year - 1)
          },
          'quantity': 4,
          'extendedCost': 40,
          'userName': ''
        }
      ],
      'cost': 120,
      'quantity': 6,
      'amountPaid': 0,
      'delivered': true
    },
    'year': year,
    'customerName': 'John Smith',
    'phone': '555-111-1111',
    'custEmail': 'john@example.com',
    'streetAddress': '125 S Broad St',
    'city': 'Philadelphia',
    'state': 'PA',
    'zipCode': '19109',
    'donation': '0.00',
    'user': 1
  };
};
const createCustomers = (app) => {
  return app.service('customers').create([
    createOrderC1(1),
    createOrderC2(1),

    createOrderC1(2),
    createOrderC2(2),

    createOrderC1(3),
    createOrderC2(3),

  ]);
};



module.exports = {
  createCustomers: createCustomers
};
