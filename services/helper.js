var mysql = require('mysql');

var helper = {
    escape_string: function(str){
        return mysql.escape(str);
    },
    mysql_escape_string: function(str) {
        return str.replace(/[\0\x08\x09\x1a\n\r"’'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "’":
                case "\\":
                case "%":
                    return "\\"+char; // prepends a backslash to backslash, percent,
                                      // and double/single quotes
            }
        });
    },
    sources: [
      'http://craphound.com/?feed=rss2',
      'http://www.smashingmagazine.com/feed',
      'https://hacks.mozilla.org/feed',
      'http://feeds.feedburner.com/CssTricks',
      'http://feeds.feedburner.com/NDTV-LatestNews',
      'http://feeds.feedburner.com/ndtv/TqgX',
      'http://feeds.reuters.com/reuters/MostRead',
      'http://feeds.reuters.com/reuters/businessNews',
      'http://feeds.reuters.com/reuters/healthNews',
      'http://feeds.reuters.com/reuters/entertainment',
      'http://feeds.reuters.com/reuters/lifestyle',
      'http://feeds.reuters.com/news/wealth',
      'http://feeds.reuters.com/Reuters/PoliticsNews',
      'http://feeds.reuters.com/reuters/sportsNews',
      'http://feeds.reuters.com/reuters/technologyNews',
      'http://feeds.reuters.com/Reuters/domesticNews',
      'http://feeds.reuters.com/reuters/topNews'
  ]
}

module.exports = helper;
