'use strict';

var mysql = require('./index');

var connection = mysql.connect('shop');

mysql.throughput(connection, 5000, './test');
mysql.hitratio(connection, 5000, './hit');
