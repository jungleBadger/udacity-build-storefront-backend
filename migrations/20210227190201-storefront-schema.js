'use strict';

var dbm;
var type;
var seed;

const categoriesTable = require("./partials/1-add-categories");
const productsTable = require("./partials/2-add-products");
const usersTable = require("./partials/3-add-users");
const ordersTable = require("./partials/4-add-orders");
const orderItemsTable = require("./partials/5-add-order-items");


/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db, callback) {
  await categoriesTable.up(db);
  await productsTable.up(db);
  await usersTable.up(db);
  await ordersTable.up(db);
  await orderItemsTable.up(db);

  return callback();
};

exports.down = async function(db, callback) {

  await orderItemsTable.down(db);
  await ordersTable.down(db);
  await usersTable.down(db);
  await productsTable.down(db);
  await categoriesTable.down(db);

  return callback();
};

exports._meta = {
  "version": 1
};
