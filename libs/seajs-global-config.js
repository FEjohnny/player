seajs.config({
    alias: {
       'show':'player/show.js'
    },

    // 预加载项
    preload: [this.JSON ? '' : 'json'],

    // 路径配置
    paths: './libs/',

    // 变量配置
    vars: {
        'locale': 'zh-cn'
    },

    charset: 'utf-8',

    debug: true
});
