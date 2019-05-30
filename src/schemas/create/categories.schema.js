const schema = {
  'definitions': {},
  '$schema': 'http://json-schema.org/draft-07/schema#',
  '$id': 'http://example.com/root.json',
  'type': 'object',
  'required': [
    'order',
    'categoryName',
    'year',
    'deliveryDate'
  ],
  'properties': {
    'order': {
      '$id': '#/properties/order',
      'type': 'object',
      'required': [
        'cost',
        'delivered'
      ],
      'properties': {
        'cost': {
          '$id': '#/properties/order/properties/cost',
          'type': 'string',
          'default': ''
        },
        'delivered': {
          '$id': '#/properties/order/properties/delivered',
          'type': 'boolean',
          'default': false
        }
      }
    },
    'categoryName': {
      '$id': '#/properties/categoryName',
      'type': 'string',
      'default': ''
    },
    'year': {
      '$id': '#/properties/year',
      'type': 'integer',
      'default': 0
    },
    'deliveryDate': {
      '$id': '#/properties/deliveryDate',
      'type': 'string',
      'default': ''
    }
  }
};
module.exports = schema;
