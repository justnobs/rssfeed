var express = require('express');

module.exports = function(app) {
	var router = express.Router();

	router.get('/', function(req, res, next) {
		res.render('index', {
			title: 'NodeJS RSS-Feeds',
			url: req.protocol + '://' + req.hostname + ':' + app.server.address().port + '/'
		});
	});

	app.use('/', router);
};