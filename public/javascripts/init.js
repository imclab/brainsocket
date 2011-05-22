$(function() {
    // 背景のグリッド描画.重いのであとで画像にする.
    drawGrid();
    // ボードの初期位置.センターか左上か。。。
    // とりあえず左上
    /*
    $('#sticky-board')
        .css({
            'left': ($('#board-container').width() - $('#sticky-board').width()) >> 1,
            'top' : ($('#board-container').height() - $('#sticky-board').height()) >> 1
        })
        .bind('mousedown', onBoardMouseDown);
    */
    $('#sticky-board')
        .css({'left':'0', 'top':'0'})
        .bind('mousedown', onBoardMouseDown);
    
    initializeSocket();
    $('#form').submit(function() { return false; });
    $('#submit').click(function() {
        registerSticky($('#text').val(), {
            easing  : 'easeOutQuint',
            size    : $('#font-size').val(),
        });
    });
});

function hitTest(e) {
    var str2num = function(str) {
        return parseInt(str.replace(/px/, ''));
    };
    
    var s, o, w, h, st = $('.sticky');
    for (var i = 0; i < st.length; i++) {
        s = $(st).eq(i);
        o = $(s).offset();
        w = $(s).width() + str2num($(s).css('paddingRight')) + str2num($(s).css('paddingLeft'));
        h = $(s).height() + str2num($(s).css('paddingTop')) + str2num($(s).css('paddingBottom'));
        if (e.pageX > o.left && e.pageX < o.left + w &&
            e.pageY > o.top  && e.pageY < o.top  + h) {
            return true;
        }
    }
    return false;
}

function onBoardMouseDown(e) {
    
    if (hitTest(e)) return false;
    var count = 0;
    var board           = $('#sticky-board'),
        offsetBoard     = $(board).offset(),
        offsetContainer = $('#board-container').offset(),
        mouseOffsetX    = e.pageX - offsetBoard.left,
        mouseOffsetY    = e.pageY - offsetBoard.top,
        fps             = 1000 / 30,
        destX, destY,
        intervalId = setInterval(function() {
            $(board).stop().animate({
                left: destX + 'px',
                top : destY + 'px'
            }, 100, function() {
                if ($(this).offset().left > offsetContainer.left &&
                    $(this).offset().top  > offsetContainer.top) {
                    $(this).animate({ left: '0px', top : '0px' }, 1000, 'easeOutElastic');
                } else if ($(this).offset().left > offsetContainer.left) {
                    $(this).animate({ left: '0px' }, 1000, 'easeOutElastic');
                } else if ($(this).offset().top  > offsetContainer.top) {
                    $(this).animate({ top : '0px' }, 1000, 'easeOutElastic');
                }
            });
            // デバッグよう.
            $('#counter').empty().append('<em>setInterval: ' + (count++) + '<em>');
        }, fps);
    
    $('#board-container')
        .bind('mousemove', function(e) {
            destX = (e.pageX - mouseOffsetX) - offsetContainer.left;
            destY = (e.pageY - mouseOffsetY) - offsetContainer.top;
        })
        .mouseup(function(e) {
            clearInterval(intervalId);
            $(this).unbind('mousemove');
        })
        .mouseout(function(e) {
            clearInterval(intervalId);
            $(this).unbind('mousemove');
        });
}