/*eslint quotes: ["error", "double"]*/
const schema = {
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "required": [
    "year",
    "data"
  ],
  "properties": {
    "year": {
      "$id": "#/properties/year",
      "type": "integer",
      "default": 0
    },
    "data": {
      "$id": "#/properties/data",
      "type": "object",
    }
  }
};
module.exports = schema;
