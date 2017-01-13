'use strict';

module.exports = function(connection, condition) {

  return new Promise(function (resolve, reject) {
    connection.query(`show global status like '${condition}'`, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}
