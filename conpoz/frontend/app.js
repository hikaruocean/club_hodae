var postWrite = '{{post-write}}';
var postEdit = '{{post-edit}}';
var postInner = '{{post-inner}}';
var postPosterOperateMenu = '{{post-poster-operate-menu}}';
var postContentElement = '{{post-content-element}}';
var body = '{{body}}';
var navBar = '{{nav-bar}}';
var tabWall = '{{tab-wall}}';
var tabInfo = '{{tab-info}}';
var tabQrcode = '{{tab-qrcode}}';
function initialAppPage () {
    $('body').prepend(body);
    $('#nav-bar').html(navBar);
    $('.tab[tab="wall"]').html(tabWall);
    $('.tab[tab="info"]').html(tabInfo);
    $('.tab[tab="qrcode"]').html(tabQrcode);
    $('#post-write').html(postWrite);
    $('#post-edit').html(postEdit);
    $('#post-inner').html(postInner);
    $('#post-poster-operate-menu').html(postPosterOperateMenu);
    var jsonString = '{"posterName": "Hikaru - 202 Lab.", "postTime": "11:46 2020.03.04", "postText": "久違了好朋友\\n2020致擬釣青春\\n每次釣三間總有滿滿的回憶\\n"}';
    var jsonObject = JSON.parse(jsonString);
    $('#post-contents').append(render(postContentElement, jsonObject));
    $('#post-contents').append(render(postContentElement, jsonObject));
    $('#post-contents').append(render(postContentElement, jsonObject));
    $('#post-contents').append(render(postContentElement, jsonObject));
    $('#post-contents').append(render(postContentElement, jsonObject));
    $('#post-contents').append(render(postContentElement, jsonObject));
    $('#post-contents').append(render(postContentElement, jsonObject));
    $('#post-contents').append(render(postContentElement, jsonObject));
    $('#post-mark-contents').append(render(postContentElement, jsonObject));
    $('body').append('<script src="/js/video.js"></script>');
}
$(function() {
    initialAppPage();
});
$(function() {
    var lastScrollVal = undefined;
    var iosBufferPx = 300;
    var scrollPosObject = {};

    var initialTab = 'wall';
    $('#nav-bar-ul li[tab="' + initialTab + '"]').addClass('active');
    $('.tab[tab="' + initialTab + '"]').addClass('view-display');
    /*
    處理畫面上下滑動事件 UI
    */
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
    /*
    處理切換 MEMU UI
    */
    $('#nav-bar-ul li').click(function (e) {
         if ($(this).attr('id') == 'switch-menu') {
             var left = '';
             e.preventDefault();
             if ($('#nav-bar ul').css('left') != '0px') {
                 left = '0px';
             } else {
                 left = '-75%';
             }
             $('#nav-bar ul').animate({left: left}, 150);
             return;
         }
         scrollPosObject[$('.tab.view-display').attr('tab')] = $(window).scrollTop();
         var tabVal = $(this).attr('tab');
         $('.tab[tab!="' + tabVal + '"]').removeClass('view-display');
         $('.tab[tab="' + tabVal + '"]').addClass('view-display');
         if (scrollPosObject[tabVal]) {
             $(window).scrollTop(scrollPosObject[tabVal]);
         }
         $('#nav-bar-ul li').removeClass('active');
         $(this).addClass('active');
         if (tabVal == 'qrcode') {
             startVideoStream();
         } else {
             stopVideoStream();
         }
    });
    /*
    po 文選單事件 UI
    */
    $(document).on('click', '.post-poster-operate-btn', function (e) {
        e.preventDefault();
        $('#cover').css({display: 'block', height: $(window).height() + 'px'});
        lockScroll();
        $('#post-poster-operate-menu').animate({bottom: '0px'}, 100);
    });
    /*
    修改 po 文 UI
    */
    $('#post-edit-btn').click(function (e) {
        e.preventDefault();
        closePosterOperateMenu();
        lockScroll();
        $('#post-edit .post-content textarea').css({height: ($(window).height() - 180) + 'px'});
        $('#post-edit').css({display: 'block', height: ($(window).height() + 300) + 'px'});
        $('#post-edit .post-content textarea').focus();
    });
    /*
    po 文選單退出 UI
    */
    $('#cover').click(function (e) {
        closePosterOperateMenu();
    });
    /*
    po 內頁 UI
    */
    $(document).on('click', '.post-interactive-status-reply, .post-interactive-reply', function (e) {
        e.preventDefault();
        lockScroll();
        $('#post-inner').css({display: 'block', height: ($(window).height()) + 'px'});
    });
    /*
    退出 po 內頁 UI
    */
    $('.post-inner-cancel-btn').click(function (e) {
        e.preventDefault();
        unlockScroll();
        $(this).parents('.post-inner-operate-menu').parent().css({display: 'none'});
    });
    /*
    發 po 文 UI
    */
    $('#post-post-btn').click(function (e) {
        e.preventDefault();
        lockScroll();
        $('#post-write .post-content textarea').css({height: ($(window).height() - 180) + 'px'});
        $('#post-write').css({display: 'block', height: ($(window).height() + 300) +'px'});
        $('#post-write .post-content textarea').focus();
    });
    /*
    取消 po 文 UI
    */
    $('.post-post-cancel-btn').click(function (e) {
        e.preventDefault();
        unlockScroll();
        $(this).parents('.post-write-operate-menu').parent().css({display: 'none'});
    });
});

function lockScroll () {
    $('body').css({overflow: 'hidden'});
}
function unlockScroll() {
    $('body').css({overflow: 'scroll'});
}
function closePosterOperateMenu () {
    unlockScroll();
    $('#cover').css({display: 'none'});
    $('#post-poster-operate-menu').animate({bottom: '-24rem'}, 100);
}

function render (html, dataObject) {
    for (k in dataObject) {
        html = html.replace('{{' + k + '}}', nl2br(dataObject[k], true));
    }
    return html;
}
function nl2br (str) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = '<br />';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}
