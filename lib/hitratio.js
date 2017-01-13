'use strict';

var fs = require('fs');
var async = require('async');

var showstatus = require('./showstatus');

var getData = function (connection) {
  var reqt_count  = showstatus(connection, 'Innodb_buffer_pool_read_requests');
  var read_count  = showstatus(connection, 'Innodb_buffer_pool_reads');
  return Promise.all([reqt_count, read_count]);
}

module.exports = function (connection, interval, dist) {
  var result = {};
  async.whilst(
    function() {return true;},
    function(callback) {
      getData(connection).then(values => {
        setTimeout(function() {
          var request_count = 0;
          var dist_read_count = 0;
          for (var i in values) {
            for (var j in values[i]) {
              request_count = values[i][j]['Variable_name'] === 'Innodb_buffer_pool_read_requests' ? values[i][j]['Value'] : request_count;
              dist_read_count = values[i][j]['Variable_name'] === 'Innodb_buffer_pool_reads' ? values[i][j]['Value'] : dist_read_count;
            }
          }
          var ratio = (request_count - dist_read_count) / request_count;
          result['ratio'] = ratio;
          fs.appendFileSync(dist, JSON.stringify(result) + '\r\n');
          console.log(JSON.stringify(result));
          callback(null);
        }, interval);
      });
    });
}
