var mongo = require('mongodb');
var host = "127.0.0.1";
var port = "27017";
var db = new mongo.DB('rss-feed', new mongo.Server(host, port, {}));

db.open(function(error) {
    console.log("We are connected! " + host + ":" + port);
    db.collection("user", function(error, collection){
        console.log("New collection added");
        collection.insert({
            id: '1',
            name: 'Norvert john Abella',
            twitter: 'justnobs',
            email: 'norvertjohn@gmail.com'
        }, function(){
          console.log('Successfuly Inserted Norvert john');
        });
        collection.insert({
            id: '1',
            name: 'Joe Blogs',
            twitter: 'joeblogs',
            email: 'joeblogs@gmail.com'
        }, function(){
          console.log('Successfuly Inserted Joe Blogs');
        });
    });
});
