'use strict';

var dbm;
var type;
var seed;

const TABLE_NAME = "orderProduct";
const PRODUCTS_TABLE_NAME = require("./2-add-products").TABLE_NAME;
const ORDERS_TABLE_NAME = require("./4-add-orders").TABLE_NAME;
exports.TABLE_NAME = TABLE_NAME;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable(TABLE_NAME, {

    "orderId": {
      "type": "int",
      "primaryKey": true,
      "unique": false,
      "notNull": true,
      "foreignKey": {
        "name": "order_id_fk",
        "table": ORDERS_TABLE_NAME,
        "rules": {
          "onDelete": "CASCADE",
          "onUpdate": "RESTRICT"
        },
        "mapping": "id"
      }
    },
    "productId": {
      "type": "int",
      "unique": false,
      "notNull": true,
      "primaryKey": true,
      "foreignKey": {
        "name": "product_id_fk",
        "table": PRODUCTS_TABLE_NAME,
        "rules": {
          "onDelete": "CASCADE",
          "onUpdate": "RESTRICT"
        },
        "mapping": "id"
      }
    },
    "productQuantity": {
      "type": "int",
      "unique": false,
      "notNull": true,
      "defaultValue": 0
    },
    "createdAt": {
      "type": "timestamp",
      "unique": false,
      "notNull": true
    },
    "updatedAt": {
      "type": "timestamp",
      "unique": false,
      "notNull": true
    }
  });
};
exports.down = function(db) {
  return db.dropTable(TABLE_NAME);
};

exports._meta = {
  "version": 1
};
