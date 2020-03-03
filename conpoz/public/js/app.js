$(function() {
    var lastScrollVal = undefined;
    var iosBufferPx = 300;
    $(window).scroll(function(e) {
        if (lastScrollVal) {
            if (lastScrollVal > $(this).scrollTop()) {
                //page up
                iosBufferPx = 300;
                if ($('#nav-bar').css('position') != 'fixed') {
                    $('#nav-bar').css({position: 'fixed', top: '0px'});
                }
                lastScrollVal = $(this).scrollTop();
            } else if (lastScrollVal + iosBufferPx <= $(this).scrollTop()) {
                //page down
                iosBufferPx = 0;
                if ($('#nav-bar').css('position') == 'fixed') {
                    $('#nav-bar').css({position: 'absolute', top: $(this).scrollTop()});
                }
                lastScrollVal = $(this).scrollTop();
            }
        } else {
            lastScrollVal = $(this).scrollTop();
        }
    });
    $('#setting').click(function (e) {
        var left = '';
        e.preventDefault();
        if ($('#nav-bar ul').css('left') != '0px') {
            left = '0px';
        } else {
            left = '-80%';
        }
        $('#nav-bar ul').animate({left: left}, 150);
    });
});
