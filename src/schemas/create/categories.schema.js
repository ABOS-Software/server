/*eslint quotes: ["error", "double"]*/
const schema = {
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "required": [
    "categoryName",
    "year",
    "deliveryDate"
  ],
  "properties": {
    "categoryName": {
      "$id": "#/properties/categoryName",
      "type": "string",
      "default": ""
    },
    "year": {
      "$id": "#/properties/year",
      "type": "integer",
      "default": 0
    },
    "deliveryDate": {
      "$id": "#/properties/deliveryDate",
      "type": "string",
      "default": ""
    }
  }
};
module.exports = schema;
