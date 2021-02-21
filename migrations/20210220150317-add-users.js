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
  return db.createTable("users", {
    "id": {
      "type": "int",
      "primaryKey": true,
      "autoIncrement": true,
      "unique": true,
      "notNull": true
    },
    "username": {
      "type": "string",
      "unique": true,
      "notNull": true
    },
    "firstName": {
      "type": "string",
      "unique": false,
      "notNull": true
    },
    "lastName": {
      "type": "string",
      "unique": false,
      "notNull": true
    },
    "password": {
      "type": "string",
      "unique": false,
      "notNull": true
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
  return db.dropTable("users");
};


exports._meta = {
  "version": 1
};
