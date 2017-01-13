'use strict'

var mysql = require('mysql');

module.exports = function (database) {

  var connection = mysql.createConnection({
    host     : 'hostname',
    port     : 'port',
    user     : 'username',
    password : 'password',
    database : database
  });

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

  return connection;
}

