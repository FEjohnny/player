/**
 * Created by cjun on 2016/12/26.
 * 支持AMD、CMD、node模块引入使用
 */
;(function (name, definition) {
    // 检测上下文环境是否为AMD或CMD
    var hasDefine = typeof define === 'function',
    // 检查上下文环境是否为Node
        hasExports = typeof module !== 'undefined' && module.exports;
    if (hasDefine) {
        // AMD环境或CMD环境
        define(definition);
    } else if (hasExports) {
        // 定义为普通Node模块
        module.exports = definition();
    } else {
        // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
        this[name] = definition();
    }
})('play', function () {
    var player = {
        element:$('#lesson-video-content'),
        attrs:{},
        init: function (options) {
            this.setAttrs();
            this.show();
            //初始化
            CloudVideoPlayer.init({
                element: '#lesson-player',
                url: this.attrs.url,
                autoplay:this.attrs.auto,
                fingerprint: this.attrs.fingerprint,
                fingerprintSrc: this.attrs.fingerprintSrc,
                watermark: this.attrs.watermark,
                starttime: this.attrs.starttime,
                agentInWhiteList: this.attrs.agentInWhiteList
            });
            this.addEvent();
        },
        setAttrs: function () {
            this.attrs.watchLimit=this.element.data('watchLimit'),
                this.attrs.playerType=this.element.data('player'),
                this.attrs.fileType=this.element.data('fileType'),
                this.attrs.url=this.element.data('url'),
                this.attrs.watermark=this.element.data('watermark'),
                this.attrs.fingerprint=this.element.data('fingerprint'),
                this.attrs.fingerprintSrc=this.element.data('fingerprintSrc'),
                this.attrs.balloonVideoPlayer=this.element.data('balloonVideoPlayer'),
                this.attrs.starttime=this.element.data('starttime'),
                this.attrs.agentInWhiteList=this.element.data('agentInWhiteList'),
                this.attrs.auto=this.element.data('auto'),
                this.attrs.html=""
        },
        show: function () {
            if(this.attrs.fileType == 'video'){
                if (this.attrs.playerType == 'local-video-player' || this.attrs.playerType == 'qiniu-video-player'){
                    this.attrs.html += '<video id="lesson-player" style="width: 100%;height: 100%;" class="video-js vjs-default-skin" controls preload="auto"></video>';
                } else {
                    this.attrs.html += '<video id="lesson-player" style="width: 100%;height: 100%;" class="video-js vjs-default-skin"></video>';
                }
            }
            if (this.attrs.balloonVideoPlayer && this.attrs.fileType == 'video' && !swfobject.hasFlashPlayerVersion('11')) {
                this.attrs.html = '<div class="alert alert-warning alert-dismissible fade in" role="alert">';
                this.attrs.html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
                this.attrs.html += '<span aria-hidden="true">×</span>';
                this.attrs.html += '</button>';
                this.attrs.html += '您的浏览器未安装Flash播放器或版本太低，请先安装Flash播放器，';
                this.attrs.html += '或前往<a href="/mobile" target="parent">下载App</a>。';
                this.attrs.html += '</div>';
                this.element.html(this.attrs.html);
                this.element.show();
                return;
            }
            this.element.html(this.attrs.html);
            this.element.show();

        },
        addEvent: function () {
            //注册事件
            CloudVideoPlayer.addEvent('ready', function () {
                alert('ready');
            });
            CloudVideoPlayer.addEvent('paused', function () {
                alert('paused');
            });
            CloudVideoPlayer.addEvent('playing', function () {
                alert('playing');
            });
            CloudVideoPlayer.addEvent('ended', function () {
            });
            CloudVideoPlayer.addEvent('destroy', function () {
            });
            CloudVideoPlayer.addEvent('complete', function () {
            });
            CloudVideoPlayer.addEvent('timeChange', function () {
            });
        }
    };
    var play = function () {
        player.init();
    }();
    return play;
});


