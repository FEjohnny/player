define(function(require, exports, module) {
    var $ = window.jQuery = jQuery = require('jquery')
    var swfobject = require('swfobject');
    var CloudVideoPlayer = require('./cloud-video-player-own');

    exports.run = function() {
        var videoHtml = $('#lesson-video-content');

        var watchLimit = videoHtml.data('watchLimit');
        var playerType = videoHtml.data('player');
        var fileType = videoHtml.data('fileType');
        var url = videoHtml.data('url');
        var watermark = videoHtml.data('watermark');
        var fingerprint = videoHtml.data('fingerprint');
        var fingerprintSrc = videoHtml.data('fingerprintSrc');
        var balloonVideoPlayer = videoHtml.data('balloonVideoPlayer');
        var starttime = videoHtml.data('starttime');
        var agentInWhiteList = videoHtml.data('agentInWhiteList');
        var auto = videoHtml.data('auto');
        var html = "";
        if(fileType == 'video'){
            if (playerType == 'local-video-player' || playerType == 'qiniu-video-player'){
                html += '<video id="lesson-player" style="width: 100%;height: 100%;" class="video-js vjs-default-skin" controls preload="auto"></video>';
            } else {
                html += '<video id="lesson-player" style="width: 100%;height: 100%;" class="video-js vjs-default-skin"></video>';
            }
        }else if(fileType == 'audio'){
            html += '<audio id="lesson-player" width="500" height="50">';
            html += '<source src="' + url + '" type="audio/mp3" />';
            html += '</audio>';
        }

         if (balloonVideoPlayer && fileType == 'video' && !swfobject.hasFlashPlayerVersion('11')) {
             html = '<div class="alert alert-warning alert-dismissible fade in" role="alert">';
             html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
             html += '<span aria-hidden="true">×</span>';
             html += '</button>';
             html += '您的浏览器未安装Flash播放器或版本太低，请先安装Flash播放器，';
             html += '或前往<a href="/mobile" target="parent">下载App</a>。';
             html += '</div>';
             videoHtml.html(html);
             videoHtml.show();
             return;
         }
        videoHtml.html(html);
        videoHtml.show();

        var player = CloudVideoPlayer.init({
            element: '#lesson-player',
            url: url,
            fingerprint: fingerprint,
            fingerprintSrc: fingerprintSrc,
            watermark: watermark,
            starttime: starttime,
            agentInWhiteList: agentInWhiteList
        });



        //player.on("ready", function(){
        //});
        //
        //player.on("paused", function(){
        //});
        //
        //player.on("playing", function(){
        //});
        //player.on("ended", function(){
        //});
        //player.on("destroy", function() {
        //});
    };
});