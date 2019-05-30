const schema = {
  'definitions': {},
  '$schema': 'http://json-schema.org/draft-07/schema#',
  '$id': 'http://example.com/root.json',
  'type': 'object',
  'required': [
    'order',
    'GroupName',
    'year'
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
    'GroupName': {
      '$id': '#/properties/GroupName',
      'type': 'string',
      'default': ''
    },
    'year': {
      '$id': '#/properties/year',
      'type': 'integer',
      'default': 0
    }
  }
};
module.exports = schema;
