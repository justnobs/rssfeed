var  db = require('./db'),
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

	});

	return io;
};
