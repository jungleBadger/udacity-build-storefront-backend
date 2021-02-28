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
  await db.createTable("categories", {
    "id": {
      "type": "int",
      "primaryKey": true,
      "autoIncrement": true,
      "unique": true,
      "notNull": true
    },
    "name": {
      "type": "string",
      "unique": false,
      "notNull": true
    },
    "description": {
      "type": "string",
      "unique": false,
      "notNull": false
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
      "categories",
      ["name", "description", "createdAt", "updatedAt"],
      ["General category", "Sample category to hold default items", new Date().toISOString(), new Date().toISOString()]
  );
  return db;
};
exports.down = function(db) {
  return db.dropTable("categories");
};

exports._meta = {
  "version": 1
};
