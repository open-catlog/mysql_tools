'use strict';

module.exports = function (connection) {
  connection.end(function (err) {
    if (err) {
      throw err;
    }
    console.log('disconnect');
  });
}
