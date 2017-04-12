'use strict'

var mysql = require('mysql');

var config = require('../config');

module.exports = function (database) {

  var connection = mysql.createConnection({
    host: config.ip,
    port: config.port,
    user: config.username,
    password: config.password,
    database: database
  });

  connection.connect(function (err) {
    if (err) {
      console.error(`error connecting ${database}: ${err.stack}`);
      return;
    }
    console.log(`connected ${database} as id ${connection.threadId}`);
  });

  return connection;
}

