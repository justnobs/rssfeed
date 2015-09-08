var mysql = require('mysql'),
   helper = require('./helper');

var setup = {
  createMysqlDB: function() {
    var client = mysql.createConnection({
        host     : 'localhost',
        user     : 'rssfeed',
        password : 'rssfeed'
    });
    client.connect();

    client.query('CREATE DATABASE rssfeedmaster', function(err, results) {
  		if (err) {
  			console.log('error on creating database');
        return false;
  		} else {
        var tbl_articles = "CREATE TABLE tbl_articles ( id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) DEFAULT NULL, link VARCHAR(255) DEFAULT NULL, url VARCHAR(255) DEFAULT NULL,likes INT(11) DEFAULT 0 )";
        var tbl_article_has_likes = "CREATE TABLE tbl_article_has_likes ( id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY, article_id INT(11) DEFAULT NULL, cookie_id VARCHAR(255) DEFAULT NULL)";

        client.query('USE rssfeedmaster', function(err, results){
            if (err) {
                console.log('ERROR USING RSSFEEDMASTER DATABASE');
            }
        });
        client.query(tbl_articles, function(err, results) {
            if (err) {
              console.log("ERROR ON CREATING TBL_ARTICLES "  + err.message);
            }
        });

        client.query(tbl_article_has_likes, function(err, results) {
            if (err) {
              console.log("ERROR ON CREATING TBL_ARTICLE_HAS_LIKES " + err.message);
            }
        });

        //recreate pool
        pool = mysql.createPool({
            connectionLimit : 100, //important
            host     : 'localhost',
            user     : 'rssfeed',
            password : 'rssfeed',
            database : 'rssfeedmaster',
            debug    :  false
        });
        return true;
      }

  	});

  },
  insertRssData: function (){
    for (var i = 0; i < helper.sources.length; i++) {
        var url =  helper.sources[i];
        setTimeout(helper.getRss(url, function(err, articles) {
          if(err) {
            console.log('ERROR on getting rss : ' + err.message);
          }
          else {
            // set the data to be save into mysql
            var values = [], arrEmit = [];
            articles.forEach(function(article){
                var data = [
                    escape(article.title),
                    escape(article.link),
                    escape(url)
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

            save(dataSaved, function(err){
                if (err) {
                  console.log('ERROR on inserting rss feeds : ' + err.message);
                }
            });
          }
        }), 2000);
    }
  }

}

function save(data, callback){
  pool.getConnection(function(err,connection){
      if (err) {
        callback({"code" : err.errno, "message" : err.message}, null);
      }

      connection.query(data.sql, [data.values], function(err){
          connection.release();
          if(err) {
              callback(err, null);
          }
      });

      connection.on('error', function(err) {
            callback({"code" : err.errno, "message" : err.message}, null);
      });

  });
}

module.exports = setup;
