var http = require('http'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('config.json')),
    host = config.host,
    port = config.port,
    server;
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
