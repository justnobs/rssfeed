var mysql = require('mysql');
var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'rssfeed',
    password : 'rssfeed',
    database : 'rssfeedmaster',
    debug    :  false
});

console.log('Connected to db');
var db = {
    get: function(data, callback){
          pool.getConnection(function(err,connection){
              if (err) {
                connection.release();
                callback({"code" : 100, "status" : "Error in connection database"}, null);
              }

              //var query = buildQuery(data);
              connection.query(data, function(err,rows){
                  connection.release();
                  endConnection();
                  if(!err) {
                      callback(null, rows);
                  }
              });

              connection.on('error', function(err) {
                    callback({"code" : 100, "status" : "Error in connection database"}, null);
              });
        });
    },
    save: function(data, callback){
          pool.getConnection(function(err,connection){
              if (err) {
                connection.release();
                callback({"code" : 100, "status" : "Error in connection database"}, null);
              }

              connection.query(data.sql, [data.values], function(err){
                  connection.release();
                  //endConnection();
                  if(err) {
                      callback(err, null);
                  }
              });

              connection.on('error', function(err) {
                    callback({"code" : 100, "status" : "Error in connection database"}, null);
              });

          });
    },
    update: function(){},
    delete: function(){},
}

function endConnection(){
    return pool.end();
}

function buildQuery(data){
    var query,
        fields = '*';

    if (data.fields != undefined) {
        fields = data.fields;
    }
    query = 'SELECT ' + fields + ' FROM ' + data.tbl_name;

    if (data.where != undefined) {
        query += ' WHERE ' + data.where[0] + ' = ' + pool.espace(data.where[1]);
    }

    if (data.order_by != undefined) {
        query += ' ORDER BY ' + data.orderby[0] + ' ' + pool.espace(data.orderby[1]);
    }
    if (data.limit != undefined) {
        query += ' LIMIT ' + pool.espace(data.limit);
    }

    return query;
}


module.exports = db;
