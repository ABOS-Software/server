/*eslint quotes: ["error", "double"]*/
const schema = {
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "required": [
    "groupName",
    "id",
    "year_id",
  ],
  "properties": {
    "groupName": {
      "$id": "#/properties/groupName",
      "type": "string",
      "default": ""
    },
    "id": {
      "$id": "#/properties/id",
      "type": "integer",
      "default": 0
    },
    "year_id": {
      "$id": "#/properties/year_id",
      "type": "integer",
      "default": 0
    },
    "year": {
      "$id": "#/properties/year",
      "type": "object",
      "required": [
        "id"
      ],
      "properties": {
        "id": {
          "$id": "#/properties/year/properties/id",
          "type": "integer",
          "default": 0
        }
      }
    },
    "user_years": {
      "$id": "#/properties/user_years",
      "type": "array"
    }
  }
};
module.exports = schema;
