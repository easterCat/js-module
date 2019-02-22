## requireJS 是一个 AMD 规范的模块加载器
主要解决的js开发的4个问题
1. 异步加载,防止阻塞页面渲染
2. 解决js文件之间的依赖关系和保证js的加载顺序
3. 按需加载

来实现一个 require 的实例
目录结构如下：
![01](https://github.com/easterCat/common_es6/blob/master/module/requireJs/01.png?raw=true)

- 首先我们现在 require.html 中将 requireJS 引入

<script type=”text/javascript” defer async=”true” src=”./require.js” data-main=”js/init.js”></script>

> - 为了防止加载的时候阻塞，需要异步进行加载
( async=”true” defer) 其中 defer 是为了兼容 ie 不识别 async 的兼容写法
当然还有简单粗暴的方法，直接将文件加载放在最后执行 
> - 同时写入 data-main=’js/init.js’，这会在 requireJS 加载完成的时候将统一目录下的 indexJS 加载进入
或者可以使用两条 script 引入
类似这样：
```
<script type=”text/javascript” defer async=”true” src=”./require.js”></script>
<script type=”text/javascript” defer async=”true” src=”js/init.js”></script>
```

- 接下来，打开 init.js

进入文件路径的配置，其中 paths 是在 lib 下面的文件地址，baseUrl 是修改默认的根目录，shim 是指定插件引入的依赖文件否则会报错（bootstrap’JavaScript requires jquery）
同时，由于 require 默认后面的后缀是.js 所以我们不能再加后缀，否则会报错

baseUrl用于定位根目录,其他路径都是相对根目录,
paths用来执行文件,或者也可以用来定位新路径

将jquery和underscore引入,写个窗口拖动变色
```
//require.config主要是用来对要加载文件的目录进行自定义
require.config({
    baseUrl: 'js',
    paths: {
        "jquery": "../lib/jquery",
        "undersocre": "../lib/underscore",
    }
})

require(['jquery', 'underscore'], function ($, _) {
    $(window).resize(function () {

        var color = ["rgba(", Math.floor(Math.random() * 255), ",", Math.floor(Math.random() * 255), ",", Math.floor(Math.random() * 255), ")"];

        $(".background").css({
            position: "fixed",
            top: "0px",
            bottom: "0px",
            left: "0px",
            right: "0px",
            background: color.join("")
        });
    })
});
```
...有点闪眼

- 注册一个模块
新建js/color.js
```
define(function () {
    var color = ["rgba(", Math.floor(Math.random() * 255), ",", Math.floor(Math.random() * 255), ",", Math.floor(Math.random() * 255), ")"];

    return {
        color: color,
    }
});
```
结构
![02](https://github.com/easterCat/common_es6/blob/master/module/requireJs/02.png?raw=true)

- paths定义别名
新建js/common/date/date.js , js/common/date/format.js
```
require.config({
    baseUrl: 'js',
    paths: {
        "jquery": "../lib/jquery",
        "underscore": "../lib/underscore",
        "date": "./common/date", //对层级深的起个别名
    }
})

require(['jquery', 'underscore', 'color', 'date/date', 'date/format'], function ($, _, c, d, f) {
    ......

    console.log(d.date);
    console.log(f.format(d.date))
});
```
![03](https://github.com/easterCat/common_es6/blob/master/module/requireJs/03.png?raw=true)


[javascript模块化编程（三）：require.js的用法](http://www.ruanyifeng.com/blog/2012/11/require_js.html)