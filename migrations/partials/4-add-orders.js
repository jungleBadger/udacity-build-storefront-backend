'use strict';

var dbm;
var type;
var seed;

const TABLE_NAME = "order";
const USERS_TABLE_NAME = require("./3-add-users").TABLE_NAME;
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
    "id": {
      "type": "int",
      "primaryKey": true,
      "autoIncrement": true,
      "unique": true,
      "notNull": true
    },
    "userId": {
      "type": "int",
      "foreignKey": {
        "name": "user_id_fk",
        "table": USERS_TABLE_NAME,
        "rules": {
          "onDelete": "CASCADE",
          "onUpdate": "RESTRICT"
        },
        "mapping": "id"
      },
      "unique": false,
      "notNull": true
    },
    "status": {
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
  return db.dropTable(TABLE_NAME);
};


exports._meta = {
  "version": 1
};
