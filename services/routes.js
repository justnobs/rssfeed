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
              res.send({error: err, data: null});
            } else {
              res.send({error: null, data: likes});
            }
        });
	});

  router.post('/checkLikes', function(req, res, next) {
    var cookie_id = req.body.cookie_id,
        article_id = req.body.article_id, data;
        ArticlesHasLikes.find({article_id: article_id}, function(err, likes) {
          if (err){
            callback(err);
          } else {
            if (likes.length == 0) {
              var data = new ArticlesHasLikes({
                article_id: article_id,
                cookie_id: cookie_id
              });
              data.save(function(err){
                if (err) {
                  res.send(err.message);
                } else {
                  console.log('Add liked to hasArticleLike db.');
                }
              });

              db.findRssItem({'_id': article_id}, function(err, data){
                  if (err || data == undefined || data == null) {
                    console.log('Error on finding RSS Likes on ajax');
                  } else {
                    data.forEach(function(article){
                      console.log('Add like to this article : ' + article.title);
                      var newLikesCount = Number(article.likes) + 1;
                      Articles.findOneAndUpdate({'_id': article_id}, {likes: newLikesCount}, {upsert:true}, function(err, doc){
                          if (err) {
                            console.log('Have error on liking this article : ' + article.title);
                            res.send({have_like: false});
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
