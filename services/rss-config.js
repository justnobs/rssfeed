var feed = require("feed-read");

var helper = {
    interval: 10000,
    getRss : function (url, callback){
        if (url == undefined) {
            return false;
        }
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
      'http://feeds.feedburner.com/CssTricks'
    ],
    generateString: function(){
      var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var result = '';
      for (var i = 14; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
      return result;
    }

}

module.exports = helper;
