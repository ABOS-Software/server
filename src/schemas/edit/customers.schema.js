/*eslint quotes: ["error", "double"]*/
const schema ={
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "object",
  "required": [
    "id",
    "phone",
    "home",
    "interested",
    "ordered",
    "donation",
    "state",
    "latitude",
    "longitude",
    "city",
    "use_coords",
    "created_at",
    "updated_at",
    "year_id",
    "user_id",
    "userName",
    "zipCode",
    "customerName",
    "streetAddress",
    "year",
    "user",
    "order"
  ],
  "properties": {
    "id": {
      "$id": "#/properties/id",
      "type": "integer",
      "default": 0
    },
    "phone": {
      "$id": "#/properties/phone",
      "type": "string",
      "default": ""
    },
    "home": {
      "$id": "#/properties/home",
      "type": "null",
      "default": null
    },
    "interested": {
      "$id": "#/properties/interested",
      "type": "null",
      "default": null
    },
    "ordered": {
      "$id": "#/properties/ordered",
      "type": "null",
      "default": null
    },
    "donation": {
      "$id": "#/properties/donation",
      "type": "integer",
      "default": 0
    },
    "state": {
      "$id": "#/properties/state",
      "type": "string",
      "default": ""
    },
    "latitude": {
      "$id": "#/properties/latitude",
      "type": "number",
      "default": 0.0
    },
    "longitude": {
      "$id": "#/properties/longitude",
      "type": "number",
      "default": 0.0
    },
    "city": {
      "$id": "#/properties/city",
      "type": "string",
      "default": ""
    },
    "use_coords": {
      "$id": "#/properties/use_coords",
      "type": "boolean",
      "default": false
    },
    "created_at": {
      "$id": "#/properties/created_at",
      "type": "string",
      "format": "date-time",
      "readOnly": true,
      "default": ""
    },
    "updated_at": {
      "$id": "#/properties/updated_at",
      "type": "string",
      "format": "date-time",
      "default": ""
    },
    "year_id": {
      "$id": "#/properties/year_id",
      "type": "integer",
      "readOnly": true,
      "default": 0
    },
    "user_id": {
      "$id": "#/properties/user_id",
      "type": "integer",
      "readOnly": true,
      "default": 0
    },
    "userName": {
      "$id": "#/properties/userName",
      "type": "string",
      "readOnly": true,
      "default": ""
    },
    "zipCode": {
      "$id": "#/properties/zipCode",
      "type": "string",
      "default": ""
    },
    "customerName": {
      "$id": "#/properties/customerName",
      "type": "string",
      "default": ""
    },
    "streetAddress": {
      "$id": "#/properties/streetAddress",
      "type": "string",
      "default": ""
    },
    "custEmail": {
      "$id": "#/properties/custEmail",
      "type": "string",
      "default": ""
    },
    "year": {
      "$id": "#/properties/year",
      "type": "object",
      "readOnly": true,
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
    "user": {
      "$id": "#/properties/user",
      "type": "object",
      "readOnly": true,
      "required": [
        "id",
        "fullName",
        "username"
      ],
      "properties": {
        "id": {
          "$id": "#/properties/user/properties/id",
          "type": "integer",
          "default": 0
        },
        "fullName": {
          "$id": "#/properties/user/properties/fullName",
          "type": "string",
          "default": ""
        },
        "username": {
          "$id": "#/properties/user/properties/username",
          "type": "string",
          "default": ""
        }
      }
    },
    "order": {
      "$id": "#/properties/order",
      "type": "object",
      "required": [
        "id",
        "cost",
        "quantity",
        "amountPaid",
        "delivered",
        "userName",
        "orderedProducts",
        "year"
      ],
      "properties": {
        "id": {
          "$id": "#/properties/order/properties/id",
          "type": "integer",
          "default": 0,
          "readOnly": true,
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
          "type": "number",
          "default": 0.0
        },
        "delivered": {
          "$id": "#/properties/order/properties/delivered",
          "type": "boolean",
          "default": false
        },
        "userName": {
          "$id": "#/properties/order/properties/userName",
          "type": "string",
          "readOnly": true,
          "default": ""
        },
        "orderedProducts": {
          "$id": "#/properties/order/properties/orderedProducts",
          "type": "array",
          "items": {
            "$id": "#/properties/order/properties/orderedProducts/items",
            "type": "object",
            "required": [
              "id",
              "quantity",
              "userName",
              "products",
              "year",
              "extendedCost"
            ],
            "properties": {
              "id": {
                "$id": "#/properties/order/properties/orderedProducts/items/properties/id",
                "type": "integer",
                "default": 0,
                "readOnly": true,
              },
              "quantity": {
                "$id": "#/properties/order/properties/orderedProducts/items/properties/quantity",
                "type": "integer",
                "default": 0
              },
              "userName": {
                "$id": "#/properties/order/properties/orderedProducts/items/properties/userName",
                "type": "string",
                "default": ""
              },
              "products": {
                "$id": "#/properties/order/properties/orderedProducts/items/properties/products",
                "type": "object",
                "readOnly": true,
                "required": [
                  "id",
                  "humanProductId",
                  "unitCost",
                  "unitSize",
                  "productName",
                  "category",
                  "year"
                ],
                "properties": {
                  "id": {
                    "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/id",
                    "type": "integer",
                    "default": 0
                  },
                  "humanProductId": {
                    "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/humanProductId",
                    "type": "string",
                    "default": ""
                  },
                  "unitCost": {
                    "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/unitCost",
                    "type": "integer",
                    "default": 0
                  },
                  "unitSize": {
                    "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/unitSize",
                    "type": "string",
                    "default": ""
                  },
                  "productName": {
                    "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/productName",
                    "type": "string",
                    "default": ""
                  },
                  "category": {
                    "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/category",
                    "type": "object",
                    "readOnly": true,
                    "required": [
                      "id",
                      "category_name",
                      "delivery_date",
                      "created_at",
                      "updated_at",
                      "year_id"
                    ],
                    "properties": {
                      "id": {
                        "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/category/properties/id",
                        "type": "integer",
                        "default": 0
                      },
                      "category_name": {
                        "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/category/properties/category_name",
                        "type": "string",
                        "default": ""
                      },
                      "delivery_date": {
                        "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/category/properties/delivery_date",
                        "type": "string",
                        "default": ""
                      },
                      "created_at": {
                        "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/category/properties/created_at",
                        "type": "string",
                        "default": ""
                      },
                      "updated_at": {
                        "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/category/properties/updated_at",
                        "type": "string",
                        "default": ""
                      },
                      "year_id": {
                        "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/category/properties/year_id",
                        "type": "integer",
                        "default": 0
                      }
                    }
                  },
                  "year": {
                    "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/year",
                    "type": "object",
                    "readOnly": true,
                    "required": [
                      "id",
                      "year"
                    ],
                    "properties": {
                      "id": {
                        "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/year/properties/id",
                        "type": "integer",
                        "default": 0
                      },
                      "year": {
                        "$id": "#/properties/order/properties/orderedProducts/items/properties/products/properties/year/properties/year",
                        "type": "string",
                        "default": ""
                      }
                    }
                  }
                }
              },
              "year": {
                "$id": "#/properties/order/properties/orderedProducts/items/properties/year",
                "type": "object",
                "readOnly": true,
                "required": [
                  "id",
                  "year"
                ],
                "properties": {
                  "id": {
                    "$id": "#/properties/order/properties/orderedProducts/items/properties/year/properties/id",
                    "type": "integer",
                    "default": 0
                  },
                  "year": {
                    "$id": "#/properties/order/properties/orderedProducts/items/properties/year/properties/year",
                    "type": "string",
                    "default": ""
                  }
                }
              },
              "extendedCost": {
                "$id": "#/properties/order/properties/orderedProducts/items/properties/extendedCost",
                "type": "integer",
                "default": 0
              }
            }
          }
        },
        "year": {
          "$id": "#/properties/order/properties/year",
          "type": "object",
          "readOnly": true,
          "required": [
            "id",
            "year"
          ],
          "properties": {
            "id": {
              "$id": "#/properties/order/properties/year/properties/id",
              "type": "integer",
              "default": 0
            },
            "year": {
              "$id": "#/properties/order/properties/year/properties/year",
              "type": "string",
              "default": ""
            }
          }
        }
      }
    }
  }
};
module.exports = schema;
