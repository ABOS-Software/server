/*eslint quotes: ["error", "double"]*/
const schema = {
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "required": [
    "username",
    "full_name",
    "password"
  ],
  "properties": {
    "username": {
      "$id": "#/properties/username",
      "type": "string",
      "default": ""
    },
    "full_name": {
      "$id": "#/properties/full_name",
      "type": "string",
      "default": ""
    },
    "password": {
      "$id": "#/properties/password",
      "type": "string",
      "default": ""
    }
  }
};
module.exports = schema;
