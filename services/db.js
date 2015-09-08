var mysql = require('mysql'),
   dbSetup = require('./db_setup');

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'rssfeed',
    password : 'rssfeed',
    database : 'rssfeedmaster',
    debug    :  false
});

console.log('Connected to db');
pool.getConnection(function(err,connection){
    if (err) {
      console.log("Error in connection database");
        if (err.errno === 1049) {
            // create new db and table
            dbSetup.createMysqlDB();
            dbSetup.insertRssData();
            console.log('Finished Predefined data');
        }
    }
});

var db = {
    get: function(data, callback){
          pool.getConnection(function(err,connection){
              if (err) {
                callback({"code" : err.errno, "message" : err.message}, null);
              }

              connection.query(data.sql, function(err,rows){
                  connection.release();
                  if(err) {
                      callback(err.message, null);
                  } else {
                      callback(null, rows);
                  }
              });

              connection.on('error', function(err) {
                    callback({"code" : err.errno, "message" : err.message}, null);
              });
        });
    },
    save: function(data, callback){
          pool.getConnection(function(err,connection){
              if (err) {
                callback({"code" : err.errno, "message" : err.message}, null);
              }

              connection.query(data.sql, [data.values], function(err){
                  connection.release();
                  if(err) {
                      callback(err, null);
                  }
              });

              connection.on('error', function(err) {
                    callback({"code" : err.errno, "message" : err.message}, null);
              });

          });
    },
    update: function(data, callback){
          pool.getConnection(function(err,connection){
              if (err) {
                callback({"code" : err.errno, "message" : err.message}, null);
              }

              connection.query(data.sql, function(err,rows){
                  connection.release();
                  if(err) {
                      callback(err.message, null);
                  } else {
                      callback(null, rows);
                  }
              });

              connection.on('error', function(err) {
                    callback({"code" : err.errno, "message" : err.message}, null);
              });
        });
    },
    delete: function(){},
}

module.exports = db;
