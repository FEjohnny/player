seajs.config({
    alias: {
        'jquery': 'jquery/1.11.2/jquery',
        '$': 'jquery/1.11.2/jquery',
        '$-debug': 'jquery/1.11.2/jquery',
        'class': 'arale/class/1.1.0/class',
        'base': 'arale/base/1.1.1/base',
        'widget': 'arale/widget/1.1.1/widget',
        'position': 'arale/position/1.0.1/position',
        'overlay': 'arale/overlay/1.1.4/overlay',
        'mask': 'arale/overlay/1.1.4/mask',
        'sticky': 'arale/sticky/1.3.1/sticky',
        'cookie': 'arale/cookie/1.0.2/cookie',
        'messenger': 'arale/messenger/2.0.0/messenger',
        "templatable": "arale/templatable/0.9.1/templatable",
        'placeholder': 'arale/placeholder/1.1.0/placeholder',
        'json': 'gallery/json/1.0.3/json',
        "swfobject": "gallery/swfobject/2.2.0/swfobject.js",
        'show':'player/show.js'
    },

    // 预加载项
    preload: [this.JSON ? '' : 'json'],

    // 路径配置
    paths: '',

    // 变量配置
    vars: {
        'locale': 'zh-cn'
    },

    charset: 'utf-8',

    debug: true
});
