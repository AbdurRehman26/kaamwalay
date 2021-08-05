define({ "api": [
  {
    "type": "get",
    "url": "/customer/addresses",
    "title": "List saved addresses",
    "name": "List_Saved_Addresses",
    "group": "Customer_Addresses",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>Saved addresses data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n     \"data\": [\n         {\n             \"id\": 1,\n             \"user_id\": 2,\n             \"first_name\": \"Isai\",\n             \"last_name\": \"Price\",\n             \"address\": \"Feestport\",\n             \"state\": \"eos\",\n             \"zip\": \"70691\",\n             \"phone\": \"+1-351-520-6142\",\n             \"flat\": \"3\",\n             \"is_default_shipping\": true,\n             \"is_default_billing\": false,\n             \"country\": {\n                 \"id\": 6,\n                 \"code\": \"BS\",\n                 \"name\": \"Azerbaijan\"\n             }\n         },\n         {\n             \"id\": 2,\n             \"user_id\": 2,\n             \"first_name\": \"Isai\",\n             \"last_name\": \"Price\",\n             \"address\": \"Feestport\",\n             \"state\": \"eos\",\n             \"zip\": \"70691\",\n             \"phone\": \"+1-351-520-6142\",\n             \"flat\": \"3\",\n             \"is_default_shipping\": true,\n             \"is_default_billing\": false,\n             \"country\": {\n                 \"id\": 6,\n                 \"code\": \"BS\",\n                 \"name\": \"Azerbaijan\"\n             }\n         }\n     ]\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "resources/apidocs/endpoints/customer/addresses/list.js",
    "groupTitle": "Customer_Addresses",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Accept",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer {token}</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/customer/addresses/states",
    "title": "List Sates",
    "name": "List_States",
    "group": "Customer_Addresses",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>States data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n     \"data\": [\n         {\n             \"id\": 1,\n             \"code\": \"AL\",\n             \"name\": \"Alabama\"\n         },\n         {\n             \"id\": 2,\n             \"code\": \"AK\",\n             \"name\": \"Alaska\"\n         },\n         {\n             \"id\": 3,\n             \"code\": \"AS\",\n             \"name\": \"American Samoa\"\n         }\n     ]\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "resources/apidocs/endpoints/customer/addresses/states/list.js",
    "groupTitle": "Customer_Addresses",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Accept",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer {token}</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/customer/orders/payment-plans/:id",
    "title": "Show saved address",
    "name": "Show_Saved_Address",
    "group": "Customer_Addresses",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>Address unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Payment Plan data</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "data.id",
            "description": "<p>Address unique ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "data.user_id",
            "description": "<p>Associated user id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.first_name",
            "description": "<p>Customer first name on address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.last_name",
            "description": "<p>Customer last name on address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.address",
            "description": "<p>Customer address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.state",
            "description": "<p>State</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.zip",
            "description": "<p>Zip</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.phone",
            "description": "<p>Phone</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.flat",
            "description": "<p>Apartment (optional)</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.is_default_shipping",
            "description": "<p>Default shipping address</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "data.is_default_billing",
            "description": "<p>Default billing address</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.country",
            "description": "<p>Country data</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "data.country.id",
            "description": "<p>Country unique ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.country.code",
            "description": "<p>Country code</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n     \"data\": {\n         \"id\": 1,\n         \"user_id\": 2,\n         \"first_name\": \"Isai\",\n         \"last_name\": \"Price\",\n         \"address\": \"Feestport\",\n         \"state\": \"eos\",\n         \"zip\": \"70691\",\n         \"phone\": \"+1-351-520-6142\",\n         \"flat\": \"3\",\n         \"is_default_shipping\": true,\n         \"is_default_billing\": false,\n         \"country\": {\n             \"id\": 6,\n             \"code\": \"BS\",\n             \"name\": \"Azerbaijan\"\n         }\n    }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "resources/apidocs/endpoints/customer/addresses/show.js",
    "groupTitle": "Customer_Addresses",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Accept",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer {token}</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/customer/addresses/states/:id",
    "title": "Show State",
    "name": "Show_State",
    "group": "Customer_Addresses",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>State unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>State data</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "data.id",
            "description": "<p>State unique ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.code",
            "description": "<p>State code</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.name",
            "description": "<p>State name</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n     \"data\": {\n         \"id\": 1,\n         \"code\": \"AL\",\n         \"name\": \"Alabama\"\n    }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "resources/apidocs/endpoints/customer/addresses/states/show.js",
    "groupTitle": "Customer_Addresses",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Accept",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer {token}</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/customer/orders/payment-plans",
    "title": "List payment plans",
    "name": "List_Payment_Plans",
    "group": "Customer_Orders",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>Payment plans data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n     \"data\": [\n         {\n             \"id\": 1,\n             \"price\": 20.50,\n             \"max_protection_amount\": 500.00,\n             \"turnaround\": \"20-30 Day\"\n         },\n         {\n             \"id\": 2,\n             \"price\": 40.00,\n             \"max_protection_amount\": 1000.00,\n             \"turnaround\": \"10-20 Day\"\n         },\n         {\n             \"id\": 3,\n             \"price\": 2000.00,\n             \"max_protection_amount\": 100000.00,\n             \"turnaround\": \"1 Day\"\n         }\n     ]\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "resources/apidocs/endpoints/customer/orders/payment-plans/list.js",
    "groupTitle": "Customer_Orders",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Accept",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer {token}</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/customer/orders/payment-plans/:id",
    "title": "Show Payment Plan",
    "name": "Show_Payment_Plan",
    "group": "Customer_Orders",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>Payment Plan unique ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Payment Plan data</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "data.id",
            "description": "<p>Payment plan unique ID</p>"
          },
          {
            "group": "Success 200",
            "type": "Float",
            "optional": false,
            "field": "data.price",
            "description": "<p>Payment plan price</p>"
          },
          {
            "group": "Success 200",
            "type": "Float",
            "optional": false,
            "field": "data.max_protection_amount",
            "description": "<p>Payment plan maximum protection amount</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.turnaround",
            "description": "<p>Payment plan turnaround time</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n     \"data\": {\n         \"id\": 1,\n         \"price\": 20.50,\n         \"max_protection_amount\": 500.00,\n         \"turnaround\": \"20-30 Day\"\n    }\n }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "resources/apidocs/endpoints/customer/orders/payment-plans/show.js",
    "groupTitle": "Customer_Orders",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Accept",
            "description": "<p>application/json</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer {token}</p>"
          }
        ]
      }
    }
  }
] });