var express = require('express');
var https = require('https');
var fs = require('fs');
var host = '127.0.0.1';
var port = '8000';
var feed = require('feed-read');

// sources: [
//   'http://www.smashingmagazine.com/feed',
//   'https://hacks.mozilla.org/feed',
//   'http://feeds.feedburner.com/CssTricks?format=xml'
// ]

var app = express();
app.use(express.static(__dirname + "/public"));

app.get("/", function(request, response){
  RssReader(function(articles){
      response.send(articles);
  });
});

// Each article has the following properties:
//   * "title"     - The article title (String).
//   * "author"    - The author's name (String).
//   * "link"      - The original article link (String).
//   * "content"   - The HTML content of the article (String).
//   * "published" - The date that the article was published (Date).
//   * "feed"      - {name, source, link}

function RssReader(callback){
  feed("http://www.smashingmagazine.com/feed", function(err, articles) {
    if (err)
      callback(err);
    else
      callback(articles);
  });
};

app.listen(port, host);
