$(document).ready(function(){
  'use strict';
  var cookie;
  socket.on('cookie', function(data){
      var cookieSplit = data.cookie_id.split('='),
          cookie_id = cookieSplit[1];
      var cookieExist = getCookie();
      if (cookieExist) {
          cookie = cookieExist;
      } else {
          setCookie(cookie_id);
          cookie = cookie_id;
      }
  });



  // add the scroll animation
  $(window).scroll(function() {
    if ($(window).scrollTop() > 2000) {
        $('#scrollTop').removeClass('hidden');
    } else {
        $('#scrollTop').addClass('hidden');
    }
 });

 $('#scrollTop').on('click', function(){
     $('html,body').animate({ scrollTop: 0 }, 'slow');
     $('#scrollTop').addClass('hidden');
     return false;
 });

  // Start of the functions
  socket.on('LoadFeed', function (data) {
      if (!data) {
          console.log('Data is not set correctly');
          return;
      }
      qty += data.length;
      $('.result-container').removeClass('hidden');
      $('.result-container').find('#numResults').text(qty + ' Results Found');

      data.forEach(function(article){
          var dataArticle = '<div class="data-row" id="'+ article._id +'" data-title="'+ article.title.toLowerCase() +'">' +
              '<div class="row">' +
                  '<div class="col-xs-1">' +
                    '<button class="btn btn-sm btn-success" id="btn_like"><span class="fa fa-thumbs-up"></span></button>' +
                    '<span class="label label-info" id="num_likes" data-likes="'+ article.likes +'">'+ article.likes +'</span>' +
                  '</div>' +
                  '<div class="col-xs-9 content-data">' +
                      '<span><a href="' + unescape(article.link) + '" class="link" target="_blank">'+ unescape(article.link) +'</a></span>' +
                      '<h4>'+ unescape(article.title) +'</h4>' +
                  '</div>' +
              '</div>' +
              '<hr>' +
          '</div>';
          $(dataArticle).hide().appendTo('#articles').show('normal');
      });
      getUserLikes();
	});

  socket.on('LoadNewestFeed', function (data) {
          if (!data) {
              console.log('Data is not set correctly');
              return;
          }
          qty += 1;
          $('.result-container').find('#numResults').text(qty + ' Results Found');

          data.forEach(function(article){
              var dataArticle = '<div class="data-row" id="'+ article._id +' data-title="'+ article.title.toLowerCase() +'>' +
                  '<div class="row">' +
                      '<div class="col-xs-1">' +
                        '<button class="btn btn-sm btn-success" id="btn_like"><span class="fa fa-thumbs-up"></span></button>' +
                        '<span class="label label-info" id="num_likes" data-likes="'+ article.likes +'">'+ article.likes +'</span>' +
                      '</div>' +
                      '<div class="col-xs-9 content-data">' +
                          '<span><a href="' + unescape(article.link) + '" class="link" target="_blank">'+ unescape(article.link) +'</a></span>' +
                          '<h4>'+ unescape(article.title) +'</h4>' +
                      '</div>' +
                  '</div>' +
                  '<hr>' +
              '</div>';
              $(dataArticle).hide().prependTo('#articles').show('normal');
          });
	});

  // START JQUERY ACTIONS
  $(document).on('click', '#btn_like', function() {
      var $row = $(this).closest('.data-row'),
    article_id = $row.attr('id'),
     num_likes = Number($row.find('#num_likes').text()),
          $btn = $(this);


     // check cookies if true then add the like
     checkCookieLikes(article_id, function(err, result){
          if (result.continue) {
              // add the likes
              num_likes = Number(num_likes) + 1;
              $row.find('#num_likes').text(num_likes);
              $row.find('#num_likes').attr('data-likes', num_likes);

              // animate up
              var prevDiv = $row.prev(),
                prevLikes = prevDiv.find('#num_likes').attr('data-likes'),
                 distance = $row.outerHeight();

              if (num_likes > Number(prevLikes) ) {
                  if (prevDiv.length) {
                      $.when($row.animate({
                          top: -distance
                      }, "fast"),
                      prevDiv.animate({
                          top: distance
                      }, "fast")).done(function () {
                          prevDiv.css('top', '0px');
                          $row.css('top', '0px');
                          $row.insertBefore(prevDiv);
                      });
                  }
              }
              // ajax and saved
              $btn.removeClass('btn-success');
              $btn.addClass('btn-info');
              $btn.attr('disabled', 'disabled');

          }
     });

  });

  // load more
  $('#btnLoadMore').on('click', function() {
        var $btnLoadMore = $(this);
        $btnLoadMore.find('#loadMoreIcon').addClass('fa-spin');
        $btnLoadMore.find('#btnLoadMoreLabel').text('Loading more data...');

        var lastID = $('#articles').children().last().attr('id');
        socket.emit('loadMore', {id: Number(lastID)});

        setTimeout(function(){
          $btnLoadMore.find('#loadMoreIcon').removeClass('fa-spin');
          $btnLoadMore.find('#btnLoadMoreLabel').text('Load More');
        }, 350);
  });


// START COOKIES
 function setCookie(cookie_id){
    var d = new Date();
    d.setTime(d.getTime() + (250*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = "rssfeedmaster=" + cookie_id + "; " + expires;
 }

 function getCookie() {
     var cookieData = document.cookie.split(';');
     for (var i = 0; i < cookieData.length; i++) {
          var cookieDsplit = cookieData[i].split('='),
                cookieName = cookieDsplit[0];
          if (cookieName == 'rssfeedmaster') {
              return cookieDsplit[1];
          }
     }
     return false;
 }

// START AJAX REQUEST
 function checkCookieLikes(article_id, callback)
 {
      var data = JSON.stringify({article_id: article_id, cookie_id: cookie});
      ajax('/checkLikes', 'POST', data)
        .done(function(result){
            if (result.have_like == false) {
                callback(null, {continue: true});
            } else {
                console.log('Already like that article');
                callback(null, {continue: false});
            }
        })
        .fail(function(){
            console.log('Failed to check cookie likes');
        });
 }

function getUserLikes(){
  var data = JSON.stringify({cookie_id: cookie});
  ajax('/getUserLikes', 'POST', data)
    .done(function(result){
        if (result.error) {
            console.log('Error on fetching user likes');
            return;
        }

        result.data.forEach(function(row){
            var $row = $('#articles').find('#'+row.article_id),
                $btn = $row.find('#btn_like');

                $btn.removeClass('btn-success');
                $btn.addClass('btn-info');
                $btn.attr('disabled', 'disabled');
        });
    })
    .fail(function(){
        console.log('Failed get user likes');
    });
}


});


// GLOBAL FUNCTIONS
function errorHandle(xhr, status, error) {
  "use strict";
  console.log(xhr);
  console.log(status);
  console.log(error);
}

function ajax(url, type, input) {
  "use strict";

  return $.ajax({
    type: type,
    url: url,
    data: input,
    dataType: 'json',
    contentType: 'application/json',
    cache: false,
    error: function (xhr, status, error) {
      errorHandle(xhr, status, error);
    }
    });
}
