var mongo = require('mongodb');
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;
var db = new mongo.DB('rss-feed', new mongo.Server(host, port, {}));

function getUser(id, callback){
    db.open(function(error) {
        console.log("We are connected! " + host + ":" + port);
        db.collection("user", function(error, collection){
            console.log("New collection added");
            collection.find({'id': id.toString()}, function(error, cursor){
                cursor.toArray(function(error, users){
                      if (users.length !== 0) {
                          //console.log('No user found');
                          callback(false);
                      } else {
                          //console.log('Found a user ' + user[0]);
                          callback(users[0]);
                      }
                });
            });
        });
    });
}

getUser(1, function(user){
    if (!user) {
        console.log('User not found');
    } else {
        console.log('Found user : ' + user);
    }
});
