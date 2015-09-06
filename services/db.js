var mysql = require('mysql');
//SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'DBName'
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
            createMysqlDB(connection);
        }
    }
});

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

function createMysqlDB()
{
  var client = mysql.createConnection({
      host     : 'localhost',
      user     : 'rssfeed',
      password : 'rssfeed'
  });
  client.connect();

  client.query('CREATE DATABASE rssfeedmaster', function(err, results) {
		if (err) {
			console.log('error on creating database');
      return false;
		} else {
      var tbl_articles = "CREATE TABLE tbl_articles ( id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) DEFAULT NULL, link VARCHAR(255) DEFAULT NULL, url VARCHAR(255) DEFAULT NULL,likes INT(11) DEFAULT 0 )";
      var tbl_user = "CREATE TABLE tbl_user ( id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY, cookie_id VARCHAR(255) DEFAULT NULL, name VARCHAR(255) DEFAULT NULL, email VARCHAR(255) DEFAULT NULL )";
      var tbl_article_has_likes = "CREATE TABLE tbl_article_has_likes ( id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY, article_id INT(11) DEFAULT NULL, user_id INT(11) DEFAULT NULL)";

      client.query('USE rssfeedmaster', function(err, results){
          if (err) {
              console.log('ERROR USING RSSFEEDMASTER DATABASE');
          }
      });
      client.query(tbl_articles, function(err, results) {
          if (err) {
            console.log("ERROR ON CREATING TBL_ARTICLES "  + err.message);
          }
      });

      client.query(tbl_user, function(err, results) {
          if (err) {
            console.log("ERROR ON CREATING TBL_USER "  + err.message);
          }
      });

      client.query(tbl_article_has_likes, function(err, results) {
          if (err) {
            console.log("ERROR ON CREATING TBL_ARTICLE_HAS_LIKES " + err.message);
          }
      });

      //recreate pool
      pool = mysql.createPool({
          connectionLimit : 100, //important
          host     : 'localhost',
          user     : 'rssfeed',
          password : 'rssfeed',
          database : 'rssfeedmaster',
          debug    :  false
      });
      return true;
    }

	});
}

module.exports = db;
