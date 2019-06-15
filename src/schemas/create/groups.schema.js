/*eslint quotes: ["error", "double"]*/
const schema = {
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "required": [
    "groupName",
    "year_id"
  ],
  "properties": {
    "groupName": {
      "$id": "#/properties/groupName",
      "type": "string",
      "default": ""
    },
    "year_id": {
      "$id": "#/properties/year_id",
      "type": "integer",
      "default": 0
    }
  }
};
module.exports = schema;
