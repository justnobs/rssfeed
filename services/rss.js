var feed = require("feed-read"),
	 async = require('async');

module.exports = {
	test: function(socket) {
		async.auto({
			loadRssItems: function(callback) {
				for (var i = 0; i < rssUrls.length; i++) {
						var url = rssUrls[i];
						feed(url, function(err, articles) {
							if(err) {
								callback(err, null);
							}
							else {
								callback(null, feedArr);
							}
						});
				}
			}
		}, function(err, results) {
			socket.emit('feed', results.loadRssItems);
		});
	}
};
