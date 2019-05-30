const schema = {
  'definitions': {},
  '$schema': 'http://json-schema.org/draft-07/schema#',
  '$id': 'http://example.com/root.json',
  'type': 'object',
  'required': [
    'id',
    'categoryName',
    'deliveryDate',
    'year'
  ],
  'properties': {
    'id': {
      '$id': '#/properties/id',
      'type': 'integer',
      'default': 0
    },
    'categoryName': {
      '$id': '#/properties/categoryName',
      'type': 'string',
      'default': ''
    },
    'deliveryDate': {
      '$id': '#/properties/deliveryDate',
      'type': 'string',
      'default': ''
    },
    'year': {
      '$id': '#/properties/year',
      'type': 'object',
      'required': [
        'id'
      ],
      'properties': {
        'id': {
          '$id': '#/properties/year/properties/id',
          'type': 'integer',
          'default': 0
        }
      }
    }
  }
};
module.exports = schema;
