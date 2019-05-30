/*eslint quotes: ["error", "double"]*/
const schema = {
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "required": [
    "year"
  ],
  "properties": {
    "year": {
      "$id": "#/properties/year",
      "type": "string",
      "default": ""
    }
  }
};
module.exports = schema;
