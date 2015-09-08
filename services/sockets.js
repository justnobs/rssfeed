var rss = require('./rss'),
	   db = require('./db'),
 helper = require('./helper'),
	async = require('async');

var cookie;

module.exports = function(app) {
	var io = require('socket.io')(app);

	io.on('connection', function (socket) {
		// ON 'init' event
		socket.emit('cookie', {cookie_id: socket.client.request.headers.cookie});
		socket.on('init', function(data) {
				console.log('Start initialized');
				var data = {
					'sql': 'SELECT * FROM tbl_articles LIMIT 0, 10'
				};
				db.get(data, function(err, rows){
						if (err) {
								console.log('Error on fetching data :' + err.message);
						} else {
								socket.emit('LoadFeed', rows);
								console.log('Done loading the feeds.');
						}
				});

		});

		socket.on('loadMore', function(data) {
				console.log('Fetching more data');
				console.log('Last ID : ');
				var LastID = data.id;

				var data = {
					'sql': 'SELECT * FROM tbl_articles LIMIT '+ LastID + ', 5'
				};
				db.get(data, function(err, rows){
						if (err) {
								console.log('Error on fetching data :' + err.message);
						} else {
								socket.emit('LoadFeed', rows);
								console.log('Done loading the feeds.');
						}
				});

		});

		socket.on('checkCookieLikes', function(data){
				var article_id = data.article_id,
						cookie_id = data.cookie_id;
				var query = "SELECT * from tbl_article_has_likes WHERE article_id = " + article_id + " AND cookie_id = '" + cookie_id + "'";

				var data = {
						'sql': query
				}
				db.get(data, function(err, rows){
						if (err) {
								console.log('Error on fetching cookie likes:' + err);
						} else {
								console.log('Rows : ' + rows);
								if (rows.length != 0) {
										socket.emit('checkCookieResult', {like : true});
								} else {
										socket.emit('checkCookieResult', {like : false});
								}
						}
				});
		});

		socket.on('addCookieLikes', function(data){
			console.log(data);
			console.log(data.length);
			if (data.length == 2) {
					shift(data);
			}
			var article_id = data.article_id,
					cookie_id = data.cookie_id,
			    dataSaved = {
		          'sql' : 'INSERT INTO tbl_article_has_likes (article_id, cookie_id) VALUES ?',
		          'values' : [[article_id, cookie_id]]
		      };
					db.save(dataSaved, function(err){
							if (err) {
								console.log('ERROR on inserting rss likes : ' + err);
							}
					});
		// update the article
					var dbUpdate = {
							'sql': "UPDATE `tbl_articles` SET `likes` = likes + 1 WHERE id = " + article_id
					}
					db.update(dbUpdate, function(err){
							if (err) {
									console.log('Error on updating article likes');
							}
					});
		});

	});

	return io;
};
