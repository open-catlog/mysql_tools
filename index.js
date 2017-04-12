'use strict';

var punt = require('punt');

var config = require('./config');
var connect = require('./lib/connect');
var throughput = require('./lib/throughput');
var hitratio = require('./lib/hitratio');

var client = punt.connect('10.1.2.11:5001');

var databases = config.databases;

for(let i = 0; i < databases.length; i++) {
  let connection = connect(databases[i]);
  throughput(connection, 5000, client, databases[i]);
  hitratio(connection, 5000, client, databases[i]);  
}