'use strict';

var fs = require('fs');
var async = require('async');

var showstatus = require('./showstatus');

var getThroughput = function (connection) {
  var com_select  = showstatus(connection, 'com_select');
  var com_insert  = showstatus(connection, 'com_insert');
  var com_update  = showstatus(connection, 'com_update');
  var com_delete  = showstatus(connection, 'com_delete');
  var connections = showstatus(connection, 'connections');

  return Promise.all([com_select, com_insert, com_update, com_delete, connections]);
}

module.exports = function (connection, interval, dist) {
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
              }
            }
            fs.appendFileSync(dist, JSON.stringify(result) + '\r\n');
          }
          preData = values;
          callback(null);
        }, interval);
      });
    }
  );
}
