'use strict';

var fs = require('fs');
var async = require('async');

var ip = require('../config').ip;
var showstatus = require('./showstatus');

var getThroughput = function (connection) {
  //查看select语句的执行次数
  var com_select  = showstatus(connection, 'com_select');
  //查看insert语句的执行次数
  var com_insert  = showstatus(connection, 'com_insert');
  //查看update语句的执行次数
  var com_update  = showstatus(connection, 'com_update');
  //查看delete语句的执行次数
  var com_delete  = showstatus(connection, 'com_delete');
  //查看试图连接到MySQL(无论是否成功)的连接数
  var connections = showstatus(connection, 'connections');

  return Promise.all([com_select, com_insert, com_update, com_delete, connections]);
}

module.exports = function (connection, interval, client, database) {
  var preData = null;
  var result = {};
  async.whilst(
    function() {return true;},
    function(callback) {
      getThroughput(connection).then(values => {
        setTimeout(function() {
          if (preData) {
            for (var i in values) {
              for (var j in values[i]) {
                result[values[i][j]['Variable_name']] = values[i][j]['Value'] - preData[i][j]['Value'];
                client.send(`${ip}@${database}@${values[i][j]['Variable_name']}@${result[values[i][j]['Variable_name']]}`);
              }
            }
          }
          preData = values;
          callback(null);
        }, interval);
      });
    }
  );
}
