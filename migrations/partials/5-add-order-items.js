'use strict';

var dbm;
var type;
var seed;

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
  return db.createTable("order_items", {
    "id": {
      "type": "int",
      "primaryKey": true,
      "autoIncrement": true,
      "unique": true,
      "notNull": true
    },
    "order_id": {
      "type": "int",
      "unique": false,
      "notNull": true,
      "foreignKey": {
        "name": "order_id_fk",
        "table": "orders",
        "rules": {
          "onDelete": "CASCADE",
          "onUpdate": "RESTRICT"
        },
        "mapping": "id"
      }
    },
    "product_id": {
      "type": "int",
      "unique": false,
      "notNull": true,
      "foreignKey": {
        "name": "product_id_fk",
        "table": "products",
        "rules": {
          "onDelete": "CASCADE",
          "onUpdate": "RESTRICT"
        },
        "mapping": "id"
      }
    },
    "product_quantity": {
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
  return db.dropTable("order_items");
};

exports._meta = {
  "version": 1
};
