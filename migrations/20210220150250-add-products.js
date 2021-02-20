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
  return db.createTable("products", {
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
    "price": {
      "type": "int"
    },
    "category": {
      "type": "string"
    }
  });
};

exports.down = function(db) {
  return db.dropTable("products");
};

exports._meta = {
  "version": 1
};
