'use strict';

var punt = require('punt');

var config = require('./config');
var connect = require('./lib/connect');
var throughput = require('./lib/throughput');

var client = punt.connect('10.1.2.57:5001');

var offline = {
  host: config.offline_ip,
  port: config.offline_port,
  username: config.offline_username,
  password: config.offline_password,
  databases: config.offline_databases
};

for(let i = 0; i < offline.databases.length; i++) {
  let connection = connect(offline.host, offline.port, offline.username, offline.password, offline.databases[i]);
  throughput(connection, 5000, client, offline.databases[i]);
}

var online = {
  host: config.online_ip,
  port: config.online_port,
  username: config.online_username,
  password: config.online_password,
  databases: config.online_databases
};

for(let i = 0; i < online.databases.length; i++) {
  let connection = connect(online.host, online.port[i], online.username, online.password, online.databases[i]);
  throughput(connection, 5000, client, online.databases[i]);
}