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
  return db.createTable("orders", {
    "id": {
      "type": "int",
      "primaryKey": true,
      "autoIncrement": true,
      "unique": true,
      "notNull": true
    },
    "user_id": {
      "type": "int",
      "foreignKey": {
        "name": "user_id_fk",
        "table": "users",
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
    }
  });
};

exports.down = function(db) {
  return db.dropTable("orders");
};


exports._meta = {
  "version": 1
};
