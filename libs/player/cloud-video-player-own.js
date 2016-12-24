define(function(require, exports, module) {
    var $ = window.jQuery = jQuery = require('jquery')
    var swfobject = require('swfobject');

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
            console.log('setup');
            window.__MediaPlayerEventProcesser = this._evetProcesser;
            window.__MediaPlayer = this;
            this.attrs.playerId =  this.attrs.element;
            if (swfobject.hasFlashPlayerVersion('10.2')) {
                //add by chenjun 解决七牛云视频播放问题，对url进行encode，防止token被播放器截掉。
                this.attrs.url.value = encodeURIComponent(this.attrs.url.value);
                this._initGrindPlayer();
            } else if (this._isSupportHtml5Video()) {
                this._initHtml5Player();

            } else {
                alert('您的浏览器未装Flash播放器或版本太低，请先安装Flash播放器。');
            }
            //CloudVideoPlayer.superclass.setup.call(this);
        },

        dispose: function(){
            console.log('dispose');
            var runtime = this.attrs.runtime;
            if (runtime == 'flash') {
                swfobject.removeSWF(this.attrs.playerId);
            } else if (runtime == 'html5') {
                $("#" + this.attrs.playerId).remove();
            }
        },

        _initHtml5Player: function() {
            console.log('_initHtml5Player');
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
            console.log('_initGrindPlayer');
            var self = this;
            var flashvars = {
                src:  this.attrs.url,
                javascriptCallbackFunction: '__MediaPlayerEventProcesser',
                autoPlay:false,
                autoRewind: false,
                loop:false,
                bufferTime: 8
            };
            flashvars.plugin_hls = "/player/libs/player/flashls-0.4.0.3.swf";
            flashvars.hls_maxbackbufferlength = 300;
            
            if (this.attrs.watermark) {
                flashvars.plugin_watermake = 'https://cdn.staticfile.org/GrindPlayerCN/1.0.2/Watermake-1.0.3.swf';
                flashvars.watermake_namespace = 'watermake';
                flashvars.watermake_url = this.attrs.watermark;
            }

            if (this.attrs.fingerprint) {
                flashvars.plugin_fingerprint = "https://cdn.staticfile.org/GrindPlayerCN/1.0.2/Fingerprint-1.0.1.swf";
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
                "https://cdn.staticfile.org/GrindPlayerCN/1.0.2/GrindPlayer.swf",
                $(this.attrs.element).attr('id'),
                this.attrs.width,  this.attrs.height , "10.2", null, flashvars, params, attrs
            );
            this.attrs.runtime='flash';
        },

        _evetProcesser: function(playerId, event, data) {
            console.log('_evetProcesser');
            var firstload= true;
            switch(event) {
                case "onJavaScriptBridgeCreated":
                    break;
                case "ready":
                    if(window.__MediaPlayer.attrs._firstPlay) {
                        var player = document.getElementById(playerId);
                        player.play2();
                        window.__MediaPlayer.trigger('ready', data);
                        window.__MediaPlayer.attrs._firstPlay=false;
                    }
                    break;
                case "complete":
                    window.__MediaPlayer._onEnded();
                    window.__MediaPlayer.trigger('ended');
                    break;
                case "timeChange":
                    window.__MediaPlayer.trigger('timechange',data);
                    break;
                case "playing":
                    window.__MediaPlayer.trigger('playing');
                    break;
                case "paused":
                    window.__MediaPlayer.trigger('paused');
                    break;
            }
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

    module.exports = CloudVideoPlayer;
});