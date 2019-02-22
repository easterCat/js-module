## 1. cmd 和 amd

在浏览器中,受网络和浏览器渲染的制约，不能采用同步加载，只能采用异步加载。于是 AMD 规范应运而生

## 2. AMD

AMD(Asynchronous Module Definition)，意思就是"异步模块定义"。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行

#### 2.1 define(module,callback)定义模块,require(module,callback)加载模块

```
require(['jquery'],function($){
    $("#bg").css({background:'red'});
})
```

第一个参数是一个数组，值是依赖的模块。回调事件会在所有依赖模块加载完毕后才会执行

#### 2.2 预加载,在定义模块的时候就提前加载好所有模块

## 3. CMD

该规范解决的浏览器环境下如何编写代码实现模块化，该规范定义可模块的一些遵循的特征，来支持能共用的模块

1. 模块单一文件
2. 不应引入模块作用域范围内的新的自由变量
3. 懒加载

#### 3.1 模块定义

define(factory)定义模块

1. define 函数接受一个参数作为模块工厂
2. factory 可以是一个函数或者其他有效值
3. 如果 factory 是一个函数，回调函数中会指定三个参数 require,exports,module
4. 如果个 factory 不是一个函数（对象，字符串），这是模块的接口就是当前对象，字符串

```
define(function(require, exports, module) {
  // do something
});
```

##### 3.2 require

1. require 函数接收一个模块标识符（模块标识符也叫模块 id）。
2. require 函数返回外部模块的导出 API（”导出 API“是用来导出内容给外部模块使用的）。
3. 如果无法返回请求的模块, require 函数将返回 null。

##### 3.3 require.async

1. require.async 接收一个模块 Id 列表和一个可选的回调函数。
2. 回调函数接收模块导出作为函数参数，按照与第一个参数中的顺序相同的顺序列出。
3. 如果不能返回请求的模块，则回调应该相应地收到 null。

#### 3.4 exports 对象

每个模块中都有个名叫"exports"的自由变量，这是一个模块可以在模块执行时添加模块 API 的对象。

#### 3.5 module 对象

1. module.uri：完整解析的模块 URI（模块 URI 的全路径）。
2. module.dependencies：模块请求的标识符（模块 id）列表。
3. module.exports：模块的导出 API（”导出 API“是”用来导出什么东西的 API“）。 它与 export 对象相同。

#### 3.6 模块标识符（模块 id）

1. 模块的标识符（模块 id）必须是字面量字符串。
2. 模块标识符（模块 id）不能有类似 .js 的文件名扩展。
3. 模块标识符（模块 id）应该是加前/后缀的字符串，比如：foo-bar。
4. 模块标识符（模块 id）可以是相对路径，例如： ./foo 和 ../bar.。

> 懒加载,在 require 时候才会加载模块

#### 3.7 一个简单的示例（seajs）

这是 seajs 对象上绑定的属性和方法

![seajs01](https://github.com/easterCat/common_es6/blob/master/module/amd%E5%92%8Ccmd/img/seajs01.png?raw=true)

color.js

```

define("color", function(require, exports, module) {
  var $ = require("jquery");

  var createColor = function() {
    return ["rgba(", Math.floor(Math.random() * 255), ",", Math.floor(Math.random() * 255), ",", Math.floor(Math.random() * 255), ")"];
  };

  module.exports = {
    changeBg: function() {
      $("#bg").css({
        position: "fixed",
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
        background: createColor().join("")
      });
    }
  };
});
```

使用非函数的工厂包装模块 text.js

```
define({
  text: "我是初始化程序",
  text2: "我要开始执行了"
});
```

init.js

```
define("init", function(require, exports, module) {
  var color = require("../src/color");
  var initText = require("../src/text");
  var $ = require("jquery");

  module.exports = {
    start: function() {
      console.log(initText.text + "," + initText.text2);
      $(function() {
        $("#change").click(function() {
          color.changeBg();
        });
      });
    }
  };
});
```

sea.js.html

```
...
<body id="bg">
    <button id="change">点我我变色</button>
</body>
<script src="./lib/sea.js"></script>
<script>
  seajs.config({
    alias: {
      underscore: "underscore.js",
      init: "./src/init.js",
      color: "./src/color.js"
    }
  });

  seajs.use(["underscore", "init"], function(u, init) {
    init.start();
  });
</script>
...
```

目录结构
![seajs02](https://github.com/easterCat/common_es6/blob/master/module/amd%E5%92%8Ccmd/img/seajs02.png?raw=true)

#### 3.8 seajs 引入其他插件或库

> 一般控制台报错 xxx is not a function

一些库不支持模块引入或者只支持 amd 规范的引入方式，不支持 cmd。所有需要对库进行一些改造

```
//Underscore.js 1.9.1
if (typeof define === "function" && define.amd && define.amd.jQuery) {
    define("underscore", [], function() {
      return _;
    });
}


//更改如下
if (typeof define === "function" && (define.amd || define.cmd)) {
    define("underscore", [], function() {
      return _;
    });
}
//或者整个define的判断不要了
if (typeof define === "function") {
    define("underscore", [], function() {
      return _;
    });
}
```

- [Common Module Definition](https://github.com/cmdjs/specification/blob/master/draft/module.md)
- [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)
- [require.js 基本使用](https://www.cnblogs.com/mybilibili/p/6773952.html)
