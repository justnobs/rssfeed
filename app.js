var express = require('express');
var fs = require('fs');
var host = '127.0.0.1';
var port = '8000';

var app = express();
app.use(express.static(__dirname + "/public"));
app.get("/", function(request, response){
  //response.setHeader("Content-Type", "text/html");
  response.send('Express success');
});

app.get("/world.html", function(request, response){
    // read the html
    var content = fs.readFileSync('/public/world.html');
    var text = '<h1>Good job!</h1>';
    response.setHeader("Content-Type", "text/html");

    // replace the text with the new text
    content = content.toString("utf8").replace("{{REPLACE_TEXT}}", text);
    response.send(content);
});
app.listen(port, host);
