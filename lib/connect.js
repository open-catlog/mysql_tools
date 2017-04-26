'use strict'

var mysql = require('mysql');

var config = require('../config');

module.exports = function (host, port, username, password, database) {

  var connection = mysql.createConnection({
    host: host,
    port: port,
    user: username,
    password: password,
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

