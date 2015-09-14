var  helper = require('./rss-config'),
     async = require('async');

var db = require('./rss-mongodb'),
    sources = helper.sources,
    cookie, offset;

var LoadRssdata = function(){
    console.log('Trying to fetch newest feed every 2 Minutes');
    for (var i = 0; i < helper.sources.length; i++) {
        helper.getRss(helper.sources[i], function(err, articles){
              // check if already existed
              if (helper.sources[i] == undefined || articles == null || articles == undefined) {
                return false;
              }
              articles.forEach(function(article){
                  db.findRssItem(article.title, function(err, rows){
                      if (rows.length == 0) {
                          // insert data
                          var data = {
                            title: article.title,
                            link: article.link,
                            published: article.published,
                            source_name: article.feed.name,
                            source: article.feed.source,
                            likes: 0
                          }
                          db.save(data, function(err){
                              if(err) console.log('Error on inserting new feed :' + err.message);
                          });
                          socket.emit('LoadNewestFeed', data);
                          console.log('Insert new feed : ' + article.title);
                      }
                  });
              });
        });
    }
}

module.exports = function(app) {
	var io = require('socket.io')(app);

	io.on('connection', function (socket) {
	  // load Articles on ArticleTitles
	  console.log('Socket Connected');
		socket.emit('cookie', {cookie_id: socket.client.request.headers.cookie});

    // ON 'init' event
		socket.on('init', function(data) {
      offset = 0;
      db.getRssItems(offset, 10, function(err, data){
          if (err) {
            console.log('Error on getting all rss : ' + err.message);
          } else {
            socket.emit('LoadFeed', data);
          }
      });
      offset += 10;
		});

		socket.on('loadMore', function(data) {
        db.getRssItems(offset, 5, function(err, data){
            if (err) {
              console.log('Error on getting all rss : ' + err.message);
            } else {
              socket.emit('LoadFeed', data);
            }
        });
        offset += 5;
		});

    // Call every 2 minutes
    setInterval(LoadRssdata, 120000);
	});

	return io;
};
