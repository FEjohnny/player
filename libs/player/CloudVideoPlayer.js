/**
 * Created by cjun on 2016/12/26.
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
})('videoplayer', function () {
    var videoplayer = function () {
        var CloudVideoPlayer = {
            attrs: {
                url: '',
                urlType: '',
                width: '100%',
                height: '100%',
                _firstPlay: true,
                runtime: null
            },
            init: function (options) {
                this.attrs = $.extend(this.attrs,options);
                this.setup();
            },
            events: {},
            setup: function() {
                window.__MediaPlayerEventProcesser = this._evetProcesser;
                window.__MediaPlayer = this;
                this.attrs.playerId =  this.attrs.element;
                if (swfobject.hasFlashPlayerVersion('10.2')) {
                    this.attrs.url.value = encodeURIComponent(this.attrs.url.value);
                    this._initGrindPlayer();
                } else if (this._isSupportHtml5Video()) {
                    this._initHtml5Player();
                } else {
                    alert('您的浏览器未装Flash播放器或版本太低，请先安装Flash播放器。');
                }
            },
            dispose: function(){
                var runtime = this.attrs.runtime;
                if (runtime == 'flash') {
                    swfobject.removeSWF(this.attrs.playerId);
                } else if (runtime == 'html5') {
                    $("#" + this.attrs.playerId).remove();
                }
            },
            _initHtml5Player: function() {
                var style= "width:" + this.attrs.width + ';height:' + this.attrs.height;
                var html = '<video id="' + this.attrs.playerId + '" src="';
                html += this.attrs.url + '" autoplay controls style="' + style + '">';
                html += '</video>';
                var parent =  $(this.attrs.element).parent();
                $(this.attrs.element).remove();
                parent.html(html);
                this.attrs.runtime = 'html5';
            },
            _isSupportHtml5Video: function() {
                return !!document.createElement('video').canPlayType;
            },
            _initGrindPlayer: function() {
                var flashvars = {
                    src:  this.attrs.url,
                    javascriptCallbackFunction: '__MediaPlayerEventProcesser',
                    autoPlay:this.attrs.autoplay,
                    autoRewind: false,
                    loop:false,
                    bufferTime: 8
                };
                flashvars.plugin_hls = "./libs/player/swf/flashls-0.4.0.3.swf";
                flashvars.hls_maxbackbufferlength = 300;

                if (this.attrs.watermark) {
                    flashvars.plugin_watermake = './libs/player/swf/Watermake-1.0.3.swf';
                    flashvars.watermake_namespace = 'watermake';
                    flashvars.watermake_url = this.attrs.watermark;
                }

                if (this.attrs.fingerprint) {
                    flashvars.plugin_fingerprint = "./libs/player/swf/Fingerprint-1.0.1.swf";
                    flashvars.fingerprint_namespace = 'fingerprint';
                    flashvars.fingerprint_src = this.attrs.fingerprintSrc;
                }

                var params = {
                    wmode:'opaque',
                    allowFullScreen: true,
                    allowScriptAccess: "always",
                    bgcolor: "#000000"
                };

                var attrs = {
                    name: $(this.attrs.element).attr('id')
                };
                swfobject.embedSWF(
                    "./libs/player/swf/GrindPlayer.swf",
                    $(this.attrs.element).attr('id'),
                    this.attrs.width,  this.attrs.height , "10.2", null, flashvars, params, attrs
                );
                this.attrs.runtime='flash';
            },
            _evetProcesser: function(playerId, event, data) {
                var firstload= true;
                switch(event) {
                    case "onJavaScriptBridgeCreated":
                        break;
                    case "ready":
                        if(window.__MediaPlayer.attrs._firstPlay) {
                            var player = document.getElementById(playerId);
                            if(window.__MediaPlayer.attrs.autoplay.value) {
                                player.play2();
                            }
                            window.__MediaPlayer.trigger('ready', data);
                            window.__MediaPlayer.attrs._firstPlay=false;
                        }
                        break;
                    case "complete":
                        window.__MediaPlayer._onEnded();
                        window.__MediaPlayer.on('ended');
                        break;
                    case "timeChange":
                        window.__MediaPlayer.on('timechange',data);
                        break;
                    case "playing":
                        window.__MediaPlayer.on('playing');
                        break;
                    case "paused":
                        window.__MediaPlayer.on('paused');
                        break;
                }
            },
            _listeners: {},
            addEvent: function(type, fn) { //注册事件
                if (typeof this._listeners[type] === "undefined") {
                    this._listeners[type] = [];
                }
                if (typeof fn === "function") {
                    this._listeners[type].push(fn);
                }
                return this;
            },
            on: function(type) { //触发事件
                var arrayEvent = this._listeners[type];
                if (arrayEvent instanceof Array) {
                    for (var i=0, length=arrayEvent.length; i<length; i+=1) {
                        if (typeof arrayEvent[i] === "function") {
                            arrayEvent[i]({
                                type: type
                            });
                        }
                    }
                }
                return this;
            },
            removeEvent: function(type, fn) {  //移除事件
                var arrayEvent = this._listeners[type];
                if (typeof type === "string" && arrayEvent instanceof Array) {
                    if (typeof fn === "function") {
                        for (var i=0, length=arrayEvent.length; i<length; i+=1){
                            if (arrayEvent[i] === fn){
                                this._listeners[type].splice(i, 1);
                                break;
                            }
                        }
                    } else {
                        delete this._listeners[type];
                    }
                }
                return this;
            },

            play: function(){
                var player = document.getElementById(this.attr.playerId);
                player.play2();
            },

            _onEnded: function(e) {
                this.setCurrentTime(0);
            },

            getCurrentTime: function() {
                var player = document.getElementById(this.attr.playerId);
                return player.getCurrentTime();
            },

            getDuration: function() {
                var player = document.getElementById(this.attr.playerId);
                return player.getDuration();
            },

            setCurrentTime: function(time) {
                var player = document.getElementById(this.attr.playerId);
                player.seek(time);
            },
            isPlaying: function() {
                var player = document.getElementById(this.attr.playerId);
                if(player.getPlaying){
                    return player.getPlaying();
                }
                return false;
            },
            destroy: function() {

            }

        };
        return window.CloudVideoPlayer=CloudVideoPlayer;
    }();
    return videoplayer;
});

