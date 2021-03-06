/*eslint quotes: ["error", "double"]*/
const schema = {
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "required": [
    "id",
    "note",
    "user_id",
    "user_name",
    "customer_id",
    "year_id",
    "note_code"
  ],
  "properties": {
    "id": {
      "$id": "#/properties/id",
      "type": "integer",
      "default": 0
    },
    "note": {
      "$id": "#/properties/note",
      "type": "string",
      "default": ""
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
    "customer_id": {
      "$id": "#/properties/customer_id",
      "type": "integer",
      "default": 0
    },
    "year_id": {
      "$id": "#/properties/year_id",
      "type": "integer",
      "default": 0
    },

    "note_code": {
      "$id": "#/properties/note_code",
      "type": "object",
      "required": [
        "id",
      ],
      "properties": {
        "id": {
          "$id": "#/properties/note_code/properties/id",
          "type": "integer",
          "default": 0
        },
        "name": {
          "$id": "#/properties/note_code/properties/name",
          "type": "string",
          "default": ""
        }
      }
    }
  }
};
module.exports = schema;
