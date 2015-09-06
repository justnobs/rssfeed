var rss = require('./rss'),
	 feed = require("feed-read"),
	   db = require('./db'),
 helper = require('./helper'),
	async = require('async');

var articlesArr = [];

function getRss(url, callback){
		feed(url, function(err, articles) {
			 if(err) {
				 callback(err, null);
			 } else {
				 // insert to db
				 callback(null, articles);
			 }
	 });
}

module.exports = function(app) {
	var io = require('socket.io')(app);

	io.on('connection', function (socket) {
		// ON 'init' event
		socket.on('init', function(data) {
				console.log('Initialized');

			 	for (var i = 0; i < helper.sources.length; i++) {
					var url =  helper.sources[i];

					setTimeout(getRss(url, function(err, articles) {
						if(err) {
							console.log(err, null);
						}
						else {
							// set the data to be save into mysql
							console.log('Successfully get articles');
							var values = [], arrEmit = [];
							articles.forEach(function(article){
									var data = [
											helper.escape_string(article.title),
											helper.escape_string(article.link),
											helper.escape_string(url)
									];
									values.push(data);

									var data2 = [
											article.title,
											article.link
									]
									arrEmit.push(data2);
							});

							// save the data
							var dataSaved = {
									'sql' : 'INSERT INTO tbl_articles (title, link, url) VALUES ?',
									'values' : values
							};

							db.save(dataSaved, function(err){
									if (err) {
										console.log(err);
									}
							});
							socket.emit('LoadFeed', values);
						}
					}), 2000);

			}

		});

	});

	return io;
};
