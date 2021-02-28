'use strict';

var dbm;
var type;
var seed;

const TABLE_NAME = "product";
const CATEGORIES_TABLE_NAME = require("./1-add-categories").TABLE_NAME;
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

exports.up = async function(db) {
  await db.createTable(TABLE_NAME, {
    "id": {
      "type": "int",
      "primaryKey": true,
      "autoIncrement": true,
      "unique": true,
      "notNull": true
    },
    "name": {
      "type": "string",
      "notNull": true
    },
    "description": {
      "type": "string",
      "unique": false,
      "notNull": false
    },
    "price": {
      "type": "real",
      "notNull": true
    },
    "categoryId": {
      "type": "int",
      "unique": false,
      "notNull": true,
      "foreignKey": {
        "name": "category_id_fk",
        "table": CATEGORIES_TABLE_NAME,
        "rules": {
          "onDelete": "CASCADE",
          "onUpdate": "RESTRICT"
        },
        "mapping": "id"
      }

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

  await db.insert(
      TABLE_NAME,
      ["name", "description", "price", "categoryId", "createdAt", "updatedAt"],
      ["Dummy product", "Sample product", 10.50, 1, new Date().toISOString(), new Date().toISOString()]
  );

  return db;

};

exports.down = function(db) {
  return db.dropTable(TABLE_NAME);
};

exports._meta = {
  "version": 1
};
