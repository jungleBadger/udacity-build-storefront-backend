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

exports.up = async function(db) {
  await db.createTable("products", {
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
    "category_id": {
      "type": "int",
      "unique": false,
      "notNull": true,
      "foreignKey": {
        "name": "category_id_fk",
        "table": "categories",
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
      "products",
      ["name", "description", "price", "category_id", "createdAt", "updatedAt"],
      ["Dummy product", "Sample product", 10.50, 1, new Date().toISOString(), new Date().toISOString()]
  );

  return db;

};

exports.down = function(db) {
  return db.dropTable("products");
};

exports._meta = {
  "version": 1
};
