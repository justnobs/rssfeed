var express = require('express'),
 bodyParser = require('body-parser')
				 db = require('./rss-mongodb'),
  ArticlesHasLikes = require('../models/articleHasLikes'),
  Articles = require('../models/articles');

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
    var cookie_id = req.body.cookie_id;
        ArticlesHasLikes.find({cookie_id: cookie_id}, function(err, likes) {
            if (err){
              callback(err);
            } else {
              console.log('Successfully fetch user likes ');
              console.log(likes);
              res.send(likes);
            }
        });
	});

  router.post('/checkLikes', function(req, res, next) {
    var cookie_id = req.body.cookie_id,
        title = req.body.title, data;
        ArticlesHasLikes.find({title: title}, function(err, likes) {
          if (err){
            callback(err);
          } else {
            if (likes.length == 0) {
                var data = new ArticlesHasLikes({
                  title: title,
                  cookie_id: cookie_id
                });
                data.save(function(err){
                  if (err) {
                    res.send(err.message);
                  }
                });
                // update db
                //
                db.findRssItem(title, function(err, data){
                    if (err || data == undefined || data == null) { console.log('Error on finding RSS Likes on ajax');
                    } else {
                      var count = 0;
                      data.forEach(function(article){
                        console.log('Add like to this article : ' + article.title);
                        var newLikesCount = Number(article.likes) + 1;
                        Articles.findOneAndUpdate({title: title}, {likes: newLikesCount}, {upsert:true}, function(err, doc){
                            if (err) { res.send({have_like: false, err: err.message});
                            } else {
                              console.log('Successfully Add like to this article : ' + article.title);
                              res.send({have_like: false});
                            }
                        });
                      });
                    }
                });

            } else {
                res.send({have_like: true});
            }
          }
      });
	});

	app.use('/', router);
};
