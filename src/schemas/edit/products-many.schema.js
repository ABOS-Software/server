/*eslint quotes: ["error", "double"]*/
const schema = {
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "required": [
    "newProducts",
    "updatedProducts",
    "deletedProducts",
    "year"
  ],
  "properties": {
    "newProducts": {
      "$id": "#/properties/newProducts",
      "type": "array",
      "items": {
        "$id": "#/properties/newProducts/items",
        "type": "object",
        "required": [
          "humanProductId",
          "id",
          "year",
          "productName",
          "unitSize",
          "unitCost",
          "category",
          "status"
        ],
        "properties": {
          "humanProductId": {
            "$id": "#/properties/newProducts/items/properties/humanProductId",
            "type": "string",
            "default": ""
          },
          "id": {
            "$id": "#/properties/newProducts/items/properties/id",
            "type": "integer",
            "default": 0
          },
          "year": {
            "$id": "#/properties/newProducts/items/properties/year",
            "type": "object",
            "required": [
              "id"
            ],
            "properties": {
              "id": {
                "$id": "#/properties/newProducts/items/properties/year/properties/id",
                "type": "integer",
                "default": 0
              }
            }
          },
          "productName": {
            "$id": "#/properties/newProducts/items/properties/productName",
            "type": "string",
            "default": ""
          },
          "unitSize": {
            "$id": "#/properties/newProducts/items/properties/unitSize",
            "type": "string",
            "default": ""
          },
          "unitCost": {
            "$id": "#/properties/newProducts/items/properties/unitCost",
            "type": "number",
            "default": 0.0
          },
          "category": {
            "$id": "#/properties/newProducts/items/properties/category",
            "type": "integer",
            "default": 0
          },
          "status": {
            "$id": "#/properties/newProducts/items/properties/status",
            "type": "string",
            "default": ""
          }
        }
      }
    },
    "updatedProducts": {
      "$id": "#/properties/updatedProducts",
      "type": "array",
      "items": {
        "$id": "#/properties/updatedProducts/items",
        "type": "object",
        "required": [
          "humanProductId",
          "id",
          "year",
          "productName",
          "unitSize",
          "unitCost",
          "category",
          "status"
        ],
        "properties": {
          "humanProductId": {
            "$id": "#/properties/updatedProducts/items/properties/humanProductId",
            "type": "string",
            "default": ""
          },
          "id": {
            "$id": "#/properties/updatedProducts/items/properties/id",
            "type": "integer",
            "default": 0
          },
          "year": {
            "$id": "#/properties/updatedProducts/items/properties/year",
            "type": "object",
            "required": [
              "id"
            ],
            "properties": {
              "id": {
                "$id": "#/properties/updatedProducts/items/properties/year/properties/id",
                "type": "integer",
                "default": 0
              }
            }
          },
          "productName": {
            "$id": "#/properties/updatedProducts/items/properties/productName",
            "type": "string",
            "default": ""
          },
          "unitSize": {
            "$id": "#/properties/updatedProducts/items/properties/unitSize",
            "type": "string",
            "default": ""
          },
          "unitCost": {
            "$id": "#/properties/updatedProducts/items/properties/unitCost",
            "type": "number",
            "default": 0.0
          },
          "category": {
            "$id": "#/properties/updatedProducts/items/properties/category",
            "type": "integer",
            "default": 0
          },
          "status": {
            "$id": "#/properties/updatedProducts/items/properties/status",
            "type": "string",
            "default": ""
          }
        }
      }
    },
    "deletedProducts": {
      "$id": "#/properties/deletedProducts",
      "type": "array",
      "items": {
        "$id": "#/properties/deletedProducts/items",
        "type": "object",
        "required": [
          "humanProductId",
          "id",
          "year",
          "productName",
          "unitSize",
          "unitCost",
          "category",
          "status"
        ],
        "properties": {
          "humanProductId": {
            "$id": "#/properties/deletedProducts/items/properties/humanProductId",
            "type": "string",
            "default": ""
          },
          "id": {
            "$id": "#/properties/deletedProducts/items/properties/id",
            "type": "integer",
            "default": 0
          },
          "year": {
            "$id": "#/properties/deletedProducts/items/properties/year",
            "type": "object",
            "required": [
              "id"
            ],
            "properties": {
              "id": {
                "$id": "#/properties/deletedProducts/items/properties/year/properties/id",
                "type": "integer",
                "default": 0
              }
            }
          },
          "productName": {
            "$id": "#/properties/deletedProducts/items/properties/productName",
            "type": "string",
            "default": ""
          },
          "unitSize": {
            "$id": "#/properties/deletedProducts/items/properties/unitSize",
            "type": "string",
            "default": ""
          },
          "unitCost": {
            "$id": "#/properties/deletedProducts/items/properties/unitCost",
            "type": "number",
            "default": 0.0
          },
          "category": {
            "$id": "#/properties/deletedProducts/items/properties/category",
            "type": "integer",
            "default": 0
          },
          "status": {
            "$id": "#/properties/deletedProducts/items/properties/status",
            "type": "string",
            "default": ""
          }
        }
      }
    },
    "year": {
      "$id": "#/properties/year",
      "type": "integer",
      "default": 0
    }
  }
};
module.exports = schema;
