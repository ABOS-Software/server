const schema = {
  'definitions': {},
  '$schema': 'http://json-schema.org/draft-07/schema#',
  '$id': 'http://example.com/root.json',
  'type': 'object',
  'required': [
    'year',
    'data'
  ],
  'properties': {
    'year': {
      '$id': '#/properties/year',
      'type': 'integer',
      'default': 0
    },
    'data': {
      '$id': '#/properties/data',
      'type': 'object',
      'required': [
        'admin',
        'patMag'
      ],
      'properties': {
        'admin': {
          '$id': '#/properties/data/properties/admin',
          'type': 'object',
          'required': [
            'checked',
            'id',
            'fullName',
            'group',
            'status',
            'subUsers',
            'enabledYear'
          ],
          'properties': {
            'checked': {
              '$id': '#/properties/data/properties/admin/properties/checked',
              'type': 'boolean',
              'default': false
            },
            'id': {
              '$id': '#/properties/data/properties/admin/properties/id',
              'type': 'integer',
              'default': 0
            },
            'fullName': {
              '$id': '#/properties/data/properties/admin/properties/fullName',
              'type': 'string',
              'default': ''
            },
            'group': {
              '$id': '#/properties/data/properties/admin/properties/group',
              'type': 'integer',
              'default': 0
            },
            'status': {
              '$id': '#/properties/data/properties/admin/properties/status',
              'type': 'string',
              'default': ''
            },
            'subUsers': {
              '$id': '#/properties/data/properties/admin/properties/subUsers',
              'type': 'object',
              'required': [
                'rotatingFans3'
              ],
              'properties': {
                'rotatingFans3': {
                  '$id': '#/properties/data/properties/admin/properties/subUsers/properties/rotatingFans3',
                  'type': 'object',
                  'required': [
                    'group',
                    'checked',
                    'status'
                  ],
                  'properties': {
                    'group': {
                      '$id': '#/properties/data/properties/admin/properties/subUsers/properties/rotatingFans3/properties/group',
                      'type': 'integer',
                      'default': 0
                    },
                    'checked': {
                      '$id': '#/properties/data/properties/admin/properties/subUsers/properties/rotatingFans3/properties/checked',
                      'type': 'boolean',
                      'default': false
                    },
                    'status': {
                      '$id': '#/properties/data/properties/admin/properties/subUsers/properties/rotatingFans3/properties/status',
                      'type': 'string',
                      'default': ''
                    }
                  }
                }
              }
            },
            'enabledYear': {
              '$id': '#/properties/data/properties/admin/properties/enabledYear',
              'type': 'integer',
              'default': 0
            }
          }
        },
        'patMag': {
          '$id': '#/properties/data/properties/patMag',
          'type': 'object',
          'required': [
            'checked',
            'id',
            'fullName',
            'group',
            'status',
            'subUsers',
            'enabledYear'
          ],
          'properties': {
            'checked': {
              '$id': '#/properties/data/properties/patMag/properties/checked',
              'type': 'boolean',
              'default': false
            },
            'id': {
              '$id': '#/properties/data/properties/patMag/properties/id',
              'type': 'integer',
              'default': 0
            },
            'fullName': {
              '$id': '#/properties/data/properties/patMag/properties/fullName',
              'type': 'string',
              'default': ''
            },
            'group': {
              '$id': '#/properties/data/properties/patMag/properties/group',
              'type': 'integer',
              'default': 0
            },
            'status': {
              '$id': '#/properties/data/properties/patMag/properties/status',
              'type': 'string',
              'default': ''
            },
            'subUsers': {
              '$id': '#/properties/data/properties/patMag/properties/subUsers',
              'type': 'object',
              'required': [
                'jaggerM',
                'rotatingFans3'
              ],
              'properties': {
                'jaggerM': {
                  '$id': '#/properties/data/properties/patMag/properties/subUsers/properties/jaggerM',
                  'type': 'object',
                  'required': [
                    'group',
                    'checked',
                    'status'
                  ],
                  'properties': {
                    'group': {
                      '$id': '#/properties/data/properties/patMag/properties/subUsers/properties/jaggerM/properties/group',
                      'type': 'integer',
                      'default': 0
                    },
                    'checked': {
                      '$id': '#/properties/data/properties/patMag/properties/subUsers/properties/jaggerM/properties/checked',
                      'type': 'boolean',
                      'default': false
                    },
                    'status': {
                      '$id': '#/properties/data/properties/patMag/properties/subUsers/properties/jaggerM/properties/status',
                      'type': 'string',
                      'default': ''
                    }
                  }
                },
                'rotatingFans3': {
                  '$id': '#/properties/data/properties/patMag/properties/subUsers/properties/rotatingFans3',
                  'type': 'object',
                  'required': [
                    'group',
                    'checked',
                    'status'
                  ],
                  'properties': {
                    'group': {
                      '$id': '#/properties/data/properties/patMag/properties/subUsers/properties/rotatingFans3/properties/group',
                      'type': 'integer',
                      'default': 0
                    },
                    'checked': {
                      '$id': '#/properties/data/properties/patMag/properties/subUsers/properties/rotatingFans3/properties/checked',
                      'type': 'boolean',
                      'default': false
                    },
                    'status': {
                      '$id': '#/properties/data/properties/patMag/properties/subUsers/properties/rotatingFans3/properties/status',
                      'type': 'string',
                      'default': ''
                    }
                  }
                }
              }
            },
            'enabledYear': {
              '$id': '#/properties/data/properties/patMag/properties/enabledYear',
              'type': 'integer',
              'default': 0
            }
          }
        }
      }
    }
  }
};
module.exports = schema;
