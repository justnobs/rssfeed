$(document).ready(function(){

  // add the scroll animation
  $(window).scroll(function() {
    if ($(window).scrollTop() > 2000) {
        $('#scrollTop').removeClass('hidden');
        console.log('Greater than : ' + $(window).scrollTop());
    } else {
        $('#scrollTop').addClass('hidden');
    }
 });

 $('#scrollTop').on('click', function(){
     $('html,body').animate({ scrollTop: 0 }, 'slow');
     $('#scrollTop').addClass('hidden');
     return false;
 });

 //
 for (var i = 0; i < 100; i++) {
      $('.content').append(
        '<div class="col-md-8 col-md-offset-2">' +
            '<div class="row">' +
                '<div class="col-xs-1">' +
                  '<button class="btn btn-sm btn-success btn_like"><span class="fa fa-thumbs-up"></span></button>' +
                  '<span class="label label-info">'+ Math.floor((Math.random() * 100) + 1) +'</span>' +
                '</div>' +
                '<div class="col-xs-9 content-data">' +
                    '<span><a href="#" class="link">www.facebook.com</a></span>' +
                    '<h4>Something that can`t be wireframed.</h4>' +
                '</div>' +
            '</div>' +
            '<hr>' +
        '</div>'
      );
  }


});
