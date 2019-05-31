/*eslint quotes: ["error", "double"]*/
const schema = {
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "required": [
    "order",
    "year",
    "customerName",
    "phone",
    "streetAddress",
    "city",
    "state",
    "zipCode",
    "user"
  ],
  "properties": {
    "order": {
      "$id": "#/properties/order",
      "type": "object",
      "required": [
        "orderedProducts",
        "cost",
        "quantity",
        "amountPaid",
        "delivered"
      ],
      "properties": {
        "orderedProducts": {
          "$id": "#/properties/order/properties/orderedProducts",
          "type": "array",
          "items": {
            "$id": "#/properties/order/properties/orderedProducts/items",
            "type": "object",
            "required": [
              "products",
              "quantity",
              "extendedCost",
              "userName"
            ],
            "properties": {
              "products": {
                "$id": "#/properties/order/properties/orderedProducts/items/properties/products",
                "type": "object",
                "required": [
                  "id"
                ],
                "properties": {
                  "id": {
                    "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/id",
                    "type": "integer",
                    "default": 0
                  }
                }
              },
              "quantity": {
                "$id": "#/properties/order/properties/orderedProducts/items/properties/quantity",
                "type": "integer",
                "default": 0
              },
              "extendedCost": {
                "$id": "#/properties/order/properties/orderedProducts/items/properties/extendedCost",
                "type": "integer",
                "default": 0
              },
              "userName": {
                "$id": "#/properties/order/properties/orderedProducts/items/properties/userName",
                "type": "string",
                "default": ""
              }
            }
          }
        },
        "cost": {
          "$id": "#/properties/order/properties/cost",
          "type": "integer",
          "default": 0
        },
        "quantity": {
          "$id": "#/properties/order/properties/quantity",
          "type": "integer",
          "default": 0
        },
        "amountPaid": {
          "$id": "#/properties/order/properties/amountPaid",
          "type": "integer",
          "default": 0
        },
        "delivered": {
          "$id": "#/properties/order/properties/delivered",
          "type": "boolean",
          "default": false
        }
      }
    },
    "year": {
      "$id": "#/properties/year",
      "type": "integer",
      "default": 0
    },
    "customerName": {
      "$id": "#/properties/customerName",
      "type": "string",
      "default": ""
    },
    "phone": {
      "$id": "#/properties/phone",
      "type": "string",
      "default": ""
    },
    "custEmail": {
      "$id": "#/properties/custEmail",
      "type": "string",
      "default": ""
    },
    "streetAddress": {
      "$id": "#/properties/streetAddress",
      "type": "string",
      "default": ""
    },
    "city": {
      "$id": "#/properties/city",
      "type": "string",
      "default": ""
    },
    "state": {
      "$id": "#/properties/state",
      "type": "string",
      "default": ""
    },
    "zipCode": {
      "$id": "#/properties/zipCode",
      "type": "string",
      "default": ""
    },
    "donation": {
      "$id": "#/properties/donation",
      "type": "string",
      "default": ""
    },
    "user": {
      "$id": "#/properties/user",
      "type": "integer",
      "default": 0
    }
  }
};
module.exports = schema;
