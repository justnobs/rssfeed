var http = require('http'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('config.json')),
    host = config.host,
    port = config.port,
    server;

var dbhost = "127.0.0.1";
var dbport = mongo.Connection.DEFAULT_PORT;
var db = new mongo.DB('rss-feed', new mongo.Server(host, port, {}));

console.log('Starting');
server = http.createServer(function(request, response){
    console.log('Received request ' + request.url);
    fs.readFile("./public" + request.url, function(error, data) {
        if (error) {
            response.writeHead(404, {"Content-Type: text/plain"});
            response.end("Sorry Page was not found");
        } else {
            response.writeHead(200, {"Content-Type: text/html"});
            response.end(data);
        };
    });
});

server.listen(port, host, function(){
    console.log('Listening ' + host + ':' + port);
});

fs.watchFile("config.json", function(){
    config = JSON.parse(fs.readFileSync("config.json"));
    host = config.host;
    port = config.port;
    server.close();
    server.listen(port, host, function(){
        console.log('Now Listening ' + host + ':' + port);
    });
});

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
