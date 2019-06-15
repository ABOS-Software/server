module.exports = {
  'newProducts': [{
    'id': 0,
    'humanProductId': '1',
    'productName': '1',
    'unitSize': '1',
    'unitCost': '10.00',
    'category': 20,
    'status': 'INSERT'
  }, {
    'id': 0,
    'humanProductId': '23',
    'productName': '3',
    'unitSize': '3',
    'unitCost': '0.03',
    'category': 21,
    'status': 'INSERT'
  }, {
    'id': 0,
    'humanProductId': '4',
    'productName': '4',
    'unitSize': '4',
    'unitCost': '40.00',
    'category': 21,
    'status': 'DELETE'
  }],
  'updatedProducts': [{
    'id': 20,
    'humanProductId':'1-u',
    'productName':'1',
    'unitSize':'3',
    'unitCost':'50.00',
    'category':21,
    'status': 'UPDATE'

  },
  ],
  'deletedProducts': [{
    'id': 23,

    'humanProductId':'2',
    'productName':'2',
    'unitSize':'4',
    'unitCost':'10.00',
    'category':21,
    'status': 'DELETE'

  }],
  'year': 20
};
