var http = require('http'),
    fs = require('fs'),
    express = require('express'),
    config = JSON.parse(fs.readFileSync('config.json')),
    host = config.host,
    port = config.port;

var app = express();
var server = http.createServer(app);

app.use(app.router);
app.use(express.static(__dirname + '/public'));

// load the index page
app.get('/', function(request, response){
    console.log(response);
    response.send('HELLO STATIC');
});

app.listen(port, host);
