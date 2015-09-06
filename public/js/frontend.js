$(document).ready(function(){
  'use strict';

  socket.on('LoadFeed', function (data) {
          $('.result-container').removeClass('hidden');
          for (var i = 0; i < data.length; i++) {
              qty += 1;

              if (qty <= 100) {
                  $('#numResults').html(qty + ' Results found');


                  var title = data[i][0],
                      link = data[i][1];

                  var dataArticle = '<div class="col-md-8 col-md-offset-2">' +
                      '<div class="row">' +
                          '<div class="col-xs-1">' +
                            '<button class="btn btn-sm btn-success btn_like"><span class="fa fa-thumbs-up"></span></button>' +
                            '<span class="label label-info">0</span>' +
                          '</div>' +
                          '<div class="col-xs-9 content-data">' +
                              '<span><a href="' + link + '" class="link" target="_blank">'+ link +'</a></span>' +
                              '<h4>'+ title +'</h4>' +
                          '</div>' +
                      '</div>' +
                      '<hr>' +
                  '</div>';
                  //$(dataArticle).hide().appendTo('#articles').show('normal');
                  $(dataArticle).hide().prependTo('#articles').show('normal');
              }
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

});
