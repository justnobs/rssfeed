var mysql = require('mysql'),
     feed = require("feed-read");

var helper = {
    escape_string: function(str){
        return mysql.escape(str);
    },
    getRss : function (url, callback){
    		feed(url, function(err, articles) {
    			 if(err) {
    				 callback(err, null);
    			 } else {
    				 // insert to db
    				 callback(null, articles);
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
      'http://feeds.reuters.com/reuters/MostRead'
  ]
}

module.exports = helper;

// 'http://feeds.reuters.com/reuters/businessNews',
// 'http://feeds.reuters.com/reuters/healthNews',
// 'http://feeds.reuters.com/reuters/entertainment',
// 'http://feeds.reuters.com/reuters/lifestyle',
// 'http://feeds.reuters.com/news/wealth',
// 'http://feeds.reuters.com/Reuters/PoliticsNews',
// 'http://feeds.reuters.com/reuters/sportsNews',
// 'http://feeds.reuters.com/reuters/technologyNews',
// 'http://feeds.reuters.com/Reuters/domesticNews',
// 'http://feeds.reuters.com/reuters/topNews'
