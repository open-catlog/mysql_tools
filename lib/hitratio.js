'use strict';

var fs = require('fs');
var async = require('async');

var showstatus = require('./showstatus');

var getData = function (connection) {
  //Innodb已经完成的逻辑读请求数
  var reqt_count  = showstatus(connection, 'Innodb_buffer_pool_read_requests');
  //不能满足Innodb必须单页读取的缓冲池中的逻辑读数量
  var read_count  = showstatus(connection, 'Innodb_buffer_pool_reads');
  return Promise.all([reqt_count, read_count]);
}

module.exports = function (connection, interval, client, database) {
  var ip = connection.config.host;
  async.whilst(
    function() {return true;},
    function(callback) {
      getData(connection).then(values => {
        setTimeout(function() {
          var request_count = 0;
          var disk_read_count = 0;
          for (var i in values) {
            for (var j in values[i]) {
              request_count = values[i][j]['Variable_name'] === 'Innodb_buffer_pool_read_requests' ? values[i][j]['Value'] : request_count;
              disk_read_count = values[i][j]['Variable_name'] === 'Innodb_buffer_pool_reads' ? values[i][j]['Value'] : disk_read_count;
            }
          }
          var ratio = (request_count - disk_read_count) / request_count;
          client.send(`${ip}@${database}@ratio@${ratio}`);
          callback(null);
        }, interval);
      });
    });
}
