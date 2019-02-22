## CommonJS 是一个模块规范

主要是单个文件定义的变量，函数，类都是私有的，其他文件不可见，单位的作用域
通过 exports(modules.exports)对外暴露接口，通过 require 加载模块
node.js 按照 CommonJS 规范实现了模块系统

## CommonJS 分为三部分

1. exports 模块导出
2. require 模块引入
3. module 模块标识

### exports 模块导出

1. CommonJs 模范规定，每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports（module.exports）属性是对外的接口。加载一个模块，实际上是加载 module.exports 属性
2. 如果想在多个文件分享变量，必须定义为 global 对象的属性

```
//m_1.js
const a = 1;
const b = 2;
const c = () => { return 3.14 * a};
const d = () => {return 3.14 * b};

exports.a = a;
exports.b = b;
exports.c = c;
exports.d = d;
```

1. 所有代码都运行在模块作用域，不会污染全局作用域
2. 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存
3. 模块加载的顺序，按照其在代码中出现的顺序

### require 模块加载

#### 基本用法

node 使用 CommonJs 规范，内置 require 命令用于加载模块文件
require 基本功能，读取并执行一个 javascript 文件，然后返回该模块的 exports 对象。如果没有相应的模块，会报错

```
//m_2.js
const f = 3;
const g = 4;
const e = () => {return f * g};
exports.e = e;
```

```
//m_3.js
const h = 99;
const i = 9;
const j = () => {return h / i};

exports.j = j;
```

```
//app.js
const m1 = require('./m_1');
const m2 = require('./m_2');
const m3 = require('./m_3');

console.log(m1.c()); //3.14
console.log(m1.d()); //6.28
console.log(m2.e()); //12
console.log(m3.j()); //11
```

#### require 加载规则

require 命令用于加载文件，后缀名默认为.js

```
var foo = require('foo');
//  等同于
var foo = require('foo.js');
```

根据参数的不同格式，require 命令去不同路径寻找模块文件

1. 以"/"开头，则表示加载的是一个位于绝对路径的模块文件
2. 以"./"开头，则表示加载的是一个位于相对路径
3. 不以"./"或"/"开头，则表示加载的是一个默认提供的核心模块

例：require('bar.js')命令，node 会依次执行

> /usr/local/lib/node/bar.js
> /home/user/projects/node_modules/bar.js
> /home/user/node_modules/bar.js
> /home/node_modules/bar.js
> /node_modules/bar.js

4. 不以"./"或"/"开头，而且是一个路径，比如 require('example-module/path/to/file')，则将先找到 example-module 的位置，然后再以它为参数，找到后续路径
5. 如果指定的模块文件没有发现，Node 会尝试为文件名添加.js、.json、.node 后，再去搜索。.js 件会以文本格式的 JavaScript 脚本文件解析，.json 文件会以 JSON 格式的文本文件解析，.node 文件会以编译后的二进制文件解析
6. 如果想得到 require 命令加载的确切文件名，使用 require.resolve()方法

#### 目录的加载规则

通常，我们会把相关的文件会放在一个目录里面，便于组织。这时，最好为该目录设置一个入口文件，让 require 方法可以通过这个入口文件，加载整个目录。

在目录中放置一个 package.json 文件，并且将入口文件写入 main 字段。下面是一个例子。

```
// package.json
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
```

#### 模块的缓存

第一次加载某个模块时，Node 会缓存该模块。以后再加载该模块，就直接从缓存取出该模块的 module.exports 属性。

```
require('./example.js');
require('./example.js').message = "hello";
require('./example.js').message
// "hello"
```

上面代码中，连续三次使用 require 命令，加载同一个模块。第二次加载的时候，为输出的对象添加了一个 message 属性。但是第三次加载的时候，这个 message 属性依然存在，这就证明 require 命令并没有重新加载模块文件，而是输出了缓存。

如果想要多次执行某个模块，可以让该模块输出一个函数，然后每次 require 这个模块的时候，重新执行一下输出的函数。

所有缓存的模块保存在 require.cache 之中，如果想删除模块的缓存，可以像下面这样写。

```
// 删除指定模块的缓存
delete require.cache[moduleName];

// 删除所有模块的缓存
Object.keys(require.cache).forEach(function(key) {
  delete require.cache[key];
})
```

注意，缓存是根据绝对路径识别模块的，如果同样的模块名，但是保存在不同的路径，require 命令还是会重新加载该模块。

require 发现参数字符串指向一个目录以后，会自动查看该目录的 package.json 文件，然后加载 main 字段指定的入口文件。如果 package.json 文件没有 main 字段，或者根本就没有 package.json 文件，则会加载该目录下的 index.js 文件或 index.node 文件。

#### 环境变量 NODE_PATH

Node 执行一个脚本时，会先查看环境变量 NODE_PATH。它是一组以冒号分隔的绝对路径。在其他位置找不到指定模块时，Node 会去这些路径查找。

可以将 NODE_PATH 添加到.bashrc。

```
export NODE_PATH="/usr/local/lib/node"
```

所以，如果遇到复杂的相对路径，比如下面这样。

```
var myModule = require('../../../../lib/myModule');
```

有两种解决方法，一是将该文件加入 node_modules 目录，二是修改 NODE_PATH 环境变量，package.json 文件可以采用下面的写法。

```
{
  "name": "node_path",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "NODE_PATH=lib node index.js"
  },
  "author": "",
  "license": "ISC"
}
```

NODE_PATH 是历史遗留下来的一个路径解决方案，通常不应该使用，而应该使用 node_modules 目录机制

#### 模块的循环加载

如果发生模块的循环加载，即 A 加载 B，B 又加载 A，则 B 将加载 A 的不完整版本。

```
// a.js
exports.x = 'a1';
console.log('a.js ', require('./b.js').x);
exports.x = 'a2';

// b.js
exports.x = 'b1';
console.log('b.js ', require('./a.js').x);
exports.x = 'b2';

// main.js
console.log('main.js ', require('./a.js').x);
console.log('main.js ', require('./b.js').x);
```

上面代码是三个 JavaScript 文件。其中，a.js 加载了 b.js，而 b.js 又加载 a.js。这时，Node 返回 a.js 的不完整版本，所以执行结果如下。

```
$ node main.js
b.js  a1
a.js  b2
main.js  a2
main.js  b2
```

修改 main.js，再次加载 a.js 和 b.js。

```
// main.js
console.log('main.js ', require('./a.js').x);
console.log('main.js ', require('./b.js').x);
console.log('main.js ', require('./a.js').x);
console.log('main.js ', require('./b.js').x);
```

执行上面代码，结果如下。

```
$ node main.js
b.js  a1
a.js  b2
main.js  a2
main.js  b2
main.js  a2
main.js  b2
```

上面代码中，第二次加载 a.js 和 b.js 时，会直接从缓存读取 exports 属性，所以 a.js 和 b.js 内部的 console.log 语句都不会执行了

#### require.main

require 方法有一个 main 属性，可以用来判断模块是直接执行，还是被调用执行。

直接执行的时候（node module.js），require.main 属性指向模块本身。

```
require.main === module
// true
```

调用执行的时候（通过 require 加载该脚本执行），上面的表达式返回 false。

### 模块的加载机制

CommonJS 模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。请看下面这个例子。

下面是一个模块文件 lib.js。

```
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

上面代码输出内部变量 counter 和改写这个变量的内部方法 incCounter。

然后，加载上面的模块。

```
// main.js
var counter = require('./lib').counter;
var incCounter = require('./lib').incCounter;

console.log(counter);  // 3
incCounter();
console.log(counter); // 3
```

上面代码说明，counter 输出以后，lib.js 模块内部的变化就影响不到 counter 了。

require 的内部处理流程
require 命令是 CommonJS 规范之中，用来加载其他模块的命令。它其实不是一个全局命令，而是指向当前模块的 module.require 命令，而后者又调用 Node 的内部命令 Module.\_load。

```
Module._load = function(request, parent, isMain) {
  // 1. 检查 Module._cache，是否缓存之中有指定模块
  // 2. 如果缓存之中没有，就创建一个新的Module实例
  // 3. 将它保存到缓存
  // 4. 使用 module.load() 加载指定的模块文件，
  //    读取文件内容之后，使用 module.compile() 执行文件代码
  // 5. 如果加载/解析过程报错，就从缓存删除该模块
  // 6. 返回该模块的 module.exports
};
```

上面的第 4 步，采用 module.compile()执行指定模块的脚本，逻辑如下。

```
Module.prototype.\_compile = function(content, filename) {
// 1. 生成一个 require 函数，指向 module.require
// 2. 加载其他辅助方法到 require
// 3. 将文件内容放到一个函数之中，该函数可调用 require
// 4. 执行该函数
};
```

上面的第 1 步和第 2 步，require 函数及其辅助方法主要如下。

> require(): 加载外部模块
> require.resolve()：将模块名解析到一个绝对路径
> require.main：指向主模块
> require.cache：指向所有缓存的模块
> require.extensions：根据文件的后缀名，调用不同的执行函数
> 一旦 require 函数准备完毕，整个所要加载的脚本内容，就被放到一个新的函数之中，这样可以避免污染全局环境。该函数的参数包括 require、module、exports，以及其他一些参数。

```
(function (exports, require, module, **filename, **dirname) {
// YOUR CODE INJECTED HERE!
});
```

Module.\_compile 方法是同步执行的，所以 Module.\_load 要等它执行完成，才会向用户返回 module.exports 的值。

### module 模块标识

node 内部提供一个 Module 构造函数，所有模块都是 Module 的实例

```
function Module(){
  this.id = id;
  this.exports = {};
  this.parent = parent;
}
```

每个模块内部，都有一个 module 对象，代表当前模块。属性如下

> module.id 模块的识别符，通常是带有绝对路径的模块文件名。
> module.filename 模块的文件名，带有绝对路径。
> module.loaded 返回一个布尔值，表示模块是否已经完成加载。
> module.parent 返回一个对象，表示调用该模块的模块。
> module.children 返回一个数组，表示该模块要用到的其他模块。
> module.exports 表示模块对外输出的值。

[node 官方文档](http://nodejs.cn/api/modules.html)
[nodejs 中 CommonJS 规范 - 阮一峰](http://javascript.ruanyifeng.com/nodejs/module.html)
[JavaScript 教程 - 阮一峰](https://wangdoc.com/javascript/)
[前端模块化详解(完整版)](https://segmentfault.com/a/1190000017466120#articleHeader6)
[js 模块化编程之彻底弄懂 CommonJS 和 AMD/CMD！](https://www.cnblogs.com/chenguangliang/p/5856701.html)
