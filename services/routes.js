var express = require('express'),
 bodyParser = require('body-parser')
				 db = require('./db');

module.exports = function(app) {
	var router = express.Router();
	app.use(bodyParser.json());
	router.get('/', function(req, res, next) {
		// console.log(req.headers); contains cookie also
		res.render('index', {
			title: 'NodeJS RSS-Feeds',
			url: req.protocol + '://' + req.hostname + ':' + app.server.address().port + '/'
		});
	});

  router.post('/getUserLikes', function(req, res, next) {
    var cookie_id = req.body.cookie_id,
        data, query;

        query = "SELECT article_id from tbl_article_has_likes WHERE cookie_id = '" + cookie_id + "'";
        data = {
          'sql': query
        };

        db.get(data, function(err, rows){
              res.send(JSON.stringify(rows));
        });

	});

	router.post('/checkLikes', function (req, res){
		 var article_id = req.body.article_id,
		 		  cookie_id = req.body.cookie_id,
					data, query;

	   query = "SELECT * from tbl_article_has_likes WHERE article_id = " + article_id + " AND cookie_id = '" + cookie_id + "'";
		 data = {
				 'sql': query
		 }
		 db.get(data, function(err, rows){
			 	if (err) {
						console.log(err);
			 	} else {

							if (rows.length != 0) {
									// already liked return false
									var response = {
									    have_like  : true
									}
									res.send(JSON.stringify(response));
							} else {
								 // not like then populate the tbl_article_has_likes
								 // and update the article and add +1
									var dataSaved = {
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

									var response = {
									    have_like  : false
									}
									res.send(JSON.stringify(response));
							}
				}

		 });

	});

	app.use('/', router);
};
