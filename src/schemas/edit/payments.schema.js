/*eslint quotes: ["error", "double"]*/
const schema ={
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "required": [
    "id",
    "amount",
    "payment_date",
    "note",
    "user_id",
    "user_name",
    "customer_id",
    "order_id",
    "year_id",
    "user",
    "year",
    "payment_method"
  ],
  "properties": {
    "id": {
      "$id": "#/properties/id",
      "type": "integer",
      "default": 0
    },
    "amount": {
      "$id": "#/properties/amount",
      "type": "integer",
      "default": 0
    },
    "payment_date": {
      "$id": "#/properties/payment_date",
      "type": "string",
      "default": ""
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
    "order_id": {
      "$id": "#/properties/order_id",
      "type": "integer",
      "default": 0
    },
    "year_id": {
      "$id": "#/properties/year_id",
      "type": "integer",
      "default": 0
    },
    "user": {
      "$id": "#/properties/user",
      "type": "object",
      "required": [
        "id"
      ],
      "properties": {
        "id": {
          "$id": "#/properties/user/properties/id",
          "type": "integer",
          "default": 0
        }
      }
    },
    "year": {
      "$id": "#/properties/year",
      "type": "object",
      "required": [
        "id",
        "year"
      ],
      "properties": {
        "id": {
          "$id": "#/properties/year/properties/id",
          "type": "integer",
          "default": 0
        },
        "year": {
          "$id": "#/properties/year/properties/year",
          "type": "string",
          "default": ""
        }
      }
    },
    "payment_method": {
      "$id": "#/properties/payment_method",
      "type": "object",
      "required": [
        "id",
        "name"
      ],
      "properties": {
        "id": {
          "$id": "#/properties/payment_method/properties/id",
          "type": "integer",
          "default": 0
        },
        "name": {
          "$id": "#/properties/payment_method/properties/name",
          "type": "string",
          "default": ""
        }
      }
    }
  }
};
module.exports = schema;
