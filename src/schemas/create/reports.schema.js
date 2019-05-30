const schema = {
  'definitions': {},
  '$schema': 'http://json-schema.org/draft-07/schema#',
  '$id': 'http://example.com/root.json',
  'type': 'object',
  'required': [
    'template',
    'Scout_name',
    'streetAddress',
    'city',
    'state',
    'zipCode',
    'Scout_Phone',
    'Scout_Rank',
    'LogoLocation',
    'Year',
    'User',
    'Include_Sub_Users',
    'Print_Due_Header',
    'Category'
  ],
  'properties': {
    'template': {
      '$id': '#/properties/template',
      'type': 'string',
      'default': ''
    },
    'Scout_name': {
      '$id': '#/properties/Scout_name',
      'type': 'string',
      'default': ''
    },
    'streetAddress': {
      '$id': '#/properties/streetAddress',
      'type': 'string',
      'default': ''
    },
    'city': {
      '$id': '#/properties/city',
      'type': 'string',
      'default': ''
    },
    'state': {
      '$id': '#/properties/state',
      'type': 'string',
      'default': ''
    },
    'zipCode': {
      '$id': '#/properties/zipCode',
      'type': 'string',
      'default': ''
    },
    'Scout_Phone': {
      '$id': '#/properties/Scout_Phone',
      'type': 'string',
      'default': ''
    },
    'Scout_Rank': {
      '$id': '#/properties/Scout_Rank',
      'type': 'string',
      'default': ''
    },
    'LogoLocation': {
      '$id': '#/properties/LogoLocation',
      'type': 'object',
      'required': [
        'rawFile',
        'src',
        'title',
        'base64'
      ],
      'properties': {
        'rawFile': {
          '$id': '#/properties/LogoLocation/properties/rawFile',
          'type': 'object',
          'required': [
            'preview'
          ],
          'properties': {
            'preview': {
              '$id': '#/properties/LogoLocation/properties/rawFile/properties/preview',
              'type': 'string',
              'default': ''
            }
          }
        },
        'src': {
          '$id': '#/properties/LogoLocation/properties/src',
          'type': 'string',
          'default': ''
        },
        'title': {
          '$id': '#/properties/LogoLocation/properties/title',
          'type': 'string',
          'default': ''
        },
        'base64': {
          '$id': '#/properties/LogoLocation/properties/base64',
          'type': 'string',
          'default': ''
        }
      }
    },
    'Year': {
      '$id': '#/properties/Year',
      'type': 'integer',
      'default': 0
    },
    'User': {
      '$id': '#/properties/User',
      'type': 'integer',
      'default': 0
    },
    'Include_Sub_Users': {
      '$id': '#/properties/Include_Sub_Users',
      'type': 'boolean',
      'default': false
    },
    'Print_Due_Header': {
      '$id': '#/properties/Print_Due_Header',
      'type': 'boolean',
      'default': false
    },
    'Category': {
      '$id': '#/properties/Category',
      'type': 'array',
      'items': {
        '$id': '#/properties/Category/items',
        'type': 'string',
        'default': ''
      }
    },
    'Customers': {
      '$id': '#/properties/Customers',
      'type': 'array',
      'items': {
        '$id': '#/properties/Customers/items',
        'type': 'string',
        'default': ''
      }
    }
  }
};
module.exports = schema;
