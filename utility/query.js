var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'rssfeed',
  password : 'rssfeed',
  database : 'rss_feed'
});

connection.connect(function(err){
 if(!err) {
     console.log("Database is connected ... \n\n");
 } else {
     console.log("Error connecting database ... \n\n");
 }
 });

function getUser(id, callback){
  if (typeof id == 'string') {
      callback(false);
  }
  connection.query('SELECT * from tbl_user where id = ' + id, function(err, rows, fields) {
    if (!err) {
      callback(rows);
    } else {
      callback(false); // return false if no rows retrieved
    }
  });
}

function getUsers(callback){
  connection.query('SELECT * from tbl_user', function(err, rows, fields) {
    if (!err) {
      callback(rows);
    } else {
      callback(false); // return false if no rows retrieved
    }
  });
}

getUsers(function(result){
    if (!result) {
        console.log('No Users retrieved');
    } else {
        console.log('Users Found');
        result.forEach(function(user,key){
             console.log(user);
        });
    }
});

getUser(function(1, result){
    if (!result) {
        console.log('No User retrieved');
    } else {
        console.log('User Found');
        result.forEach(function(user,key){
             console.log(user);
        });
    }
});

connection.end();
