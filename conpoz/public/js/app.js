$(function() {
    var lastScrollVal = undefined;
    $(window).scroll(function(e) {
        if (lastScrollVal) {
            if (lastScrollVal > $(this).scrollTop()) {
                //page up
                if ($('#nav-bar').css('position') != 'fixed') {
                    $('#nav-bar').css({position: 'fixed', top: '0px'});
                }
            } else {
                //page down
                if ($('#nav-bar').css('position') == 'fixed') {
                    $('#nav-bar').css({position: 'absolute', top: $(this).scrollTop()});
                }
            }
        }
        lastScrollVal = $(this).scrollTop();
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
