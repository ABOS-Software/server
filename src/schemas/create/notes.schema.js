/*eslint quotes: ["error", "double"]*/
const schema = {
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "required": [
    "note",
    "note_code_id",
    "year_id",
    "customer_id",
    "user_id",
    "user_name",
  ],
  "properties": {
    "note": {
      "$id": "#/properties/note",
      "type": "string",
      "default": ""
    },
    "note_code_id": {
      "$id": "#/properties/note_code_id",
      "type": "integer",
      "default": 0
    },
    "year_id": {
      "$id": "#/properties/year_id",
      "type": "integer",
      "default": 0
    },
    "customer_id": {
      "$id": "#/properties/customer_id",
      "type": "integer",
      "default": 0
    },
    "user_id": {
      "$id": "#/properties/user_id",
      "type": "integer",
      "default": 0
    },
    "user_name": {
      "$id": "#/properties/user_name",
      "type": "string",
      "default": ""
    },
    "order_id": {
      "$id": "#/properties/order_id",
      "type": "integer",
      "default": 0
    }
  }
};
module.exports = schema;
