$(document).ready(function(){
  'use strict';
  var cookie;
  socket.on('cookie', function(data){
      var cookieSplit = data.cookie_id.split('='),
          cookie_id = cookieSplit[1];
      var cookieExist = getCookie();
      if (cookieExist) {
          cookie = cookieExist;
          console.log('Cookie Exist :' + cookie);
      } else {
          setCookie(cookie_id);
          cookie = cookie_id;
          console.log('Create new cookie');
      }
  });

  // event firing :
    // on click of likes
    // animate up after like
    // add +1 to number of likes
  // used html data- data.()
  // cookie handlings
  socket.on('LoadFeed', function (data) {
          if (!data) {
              console.log('Data is not set correctly');
              return;
          }
          qty += data.length;
          $('.result-container').removeClass('hidden');
          $('.result-container').find('#numResults').text(qty + ' Results Found');
          data.forEach(function(article){
              var dataArticle = '<div class="data-row" id="'+ article.id +'">' +
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
          // disabled all the buttons that already liked by the user
          cookieDisable();
          //$(dataArticle).hide().prependTo('#articles').show('normal');
	});

  $(document).on('click', '#btn_like', function() {
      var $row = $(this).closest('.data-row'),
            id = $row.attr('id'),
     num_likes = $row.find('#num_likes').text();

    console.log('like ' + id);
     // check cookies if true then add the like
     if (checkCookieLikes(id)) {
        return;
     }

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
     $(this).removeClass('btn-success');
     $(this).addClass('btn-info');
     $(this).attr('disabled', 'disabled');
  });

  // load more
  $('#btnLoadMore').on('click', function() {
        var $btnLoadMore = $(this);
        $btnLoadMore.find('#loadMoreIcon').addClass('fa-spin');
        $btnLoadMore.find('#btnLoadMoreLabel').text('Loading more data...');

        var lastID = $('#articles').children().last().attr('id');
        console.log('last id: ' + lastID);
        socket.emit('loadMore', {id: Number(lastID)});

        setTimeout(function(){
          $btnLoadMore.find('#loadMoreIcon').removeClass('fa-spin');
          $btnLoadMore.find('#btnLoadMoreLabel').text('Load More');
        }, 350);
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

 function setCookie(cookie_id){
    var d = new Date();
    d.setTime(d.getTime() + (250*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = "rssfeedmaster=" + cookie_id + "; " + expires;
    document.cookie = "nsandklaskd=" + cookie_id + "; " + expires;
    document.cookie = "nsandklas2kd=" + cookie_id + "; " + expires;
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

 function checkCookieLikes(article_id)
 {
      socket.emit('checkCookieLikes', {article_id: article_id, cookie_id: cookie});
      socket.on('checkCookieResult', function(result){
          console.log('cookie result: ' + result);
          if (result.like == false) {
              // its already liked
              console.log('ADD NEW LIKED');
              socket.emit('addCookieLikes', {article_id: article_id, cookie_id: cookie});
              return false;
          }
          console.log('ALREADY LIKED ');
          return false;
      });
 }

 function cookieDisable(){
    console.log('TEST DISABLED');
 }

});
