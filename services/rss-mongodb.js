var mongoose = require('mongoose'),
    helper = require('./rss-config');

// Load the Router
var Articles = require('../models/articles');
var ArticlesHasLikes = require('../models/articleHasLikes');

mongoose.connect('mongodb://localhost/rssapp');
db = mongoose.connection;

db.on('error', function(err){
    console.log('Error on connecting database : ' + err.message);
});

// NOTE : START DATABASE CONFIGURATION HERE..
db.once('open', function callback () {
  console.log("Connected to database");
  var emptyData = function(){
    Articles.remove({}, function(err){
      if (err) {
        console.log('Error on removing all documents');
      } else {
        console.log('Successfully removed data');
      }
    });
  };

  setTimeout(emptyData(),1000);
  // set Predefined data
  var ctr = 0;
  var loadRss = function(url){
      helper.getRss(url, function(err, articles){
          if (url == undefined || articles == null || articles == undefined) {
              return false;
          }
          articles.forEach(function(article){
              var newArticle = new Articles({
                  title: article.title,
                  link: article.link,
                  published: article.published,
                  source_name: article.feed.name,
                  source: article.feed.source,
                  likes: 0
              });
              newArticle.save(function(err) {
                if (err) callback('Error on inserting');
              });
          });
          console.log('successfully load articles : ' + url);
      });
  }

  for (var i = 0; i < helper.sources.length; i++) {
     setTimeout(loadRss(helper.sources[i]), 2000);
  }
  console.log('Finished Predefined Data');
});


// NOTE : START DATABASE HERE..
var database = {
    save: function(data, callback){
      var newArticle = new Articles(data);
      newArticle.save(function(err) {
        if (err) callback('Error on inserting');
      });
    },
    getAllRss: function(callback){
      Articles.find({}, function(err, articles) {
          if (err){
            callback(err, null);
          } else {
            callback(null, articles);
          }
      });
    },
    getRssItems: function(offset, limit,  callback){
      Articles.find({}, null, {skip: offset, limit:limit}, function(err, data){
          if (err) {
            callback(err, null);
          } else {
            callback(null, data);
          }
      });
    },
    findRssItem: function(title, callback){
        Articles.find({'title': title}, function(err, data){
            if (err) {
              callback(err, null);
            } else {
              callback(null, data);
            }
        });
    },
    emptyArticle: function(callback){
      Articles.remove({}, function(err){
        if (err) {
          callback('Error on removing all documents');
        }
      });
    },
    updateRss: function(data, callback){
      // where : { title: 'Sample Title' }
      Articles.findOneAndUpdate(data.where, data.new, function(err, user) {
        if (err){
          callback('Error on updating Rss');
        }
      });
    },
    Articles: require('../models/articles'),
    hasLikes: require('../models/articleHasLikes')
};

module.exports = database;
