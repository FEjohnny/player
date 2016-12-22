define(function(require, exports, module) {

    var Widget = require('widget');


    var PlayerFactory = Widget.extend({
        attrs: {
        },

        events: {
        },

        setup: function() {
        },

        create: function(type, options){
            switch(type){
                case "video":
                    var CloudVideoPlayer = require('./cloud-video-player');
                    return new CloudVideoPlayer(options);
                    break;
            }
        },
        destroy: function(){
        }
    });

    module.exports = PlayerFactory;

});