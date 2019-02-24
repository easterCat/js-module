## CommonJs

主要是单个文件定义的变量，函数，类都是私有的，其他文件不可见，单位的作用域
通过 exports(modules.exports)对外暴露接口，通过 require 加载模块
node.js 按照 CommonJS 规范实现了模块系统

1. exports 模块导出
2. require 模块引入
3. module 模块标识
4. global 全局变量

### exports 模块导出

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

### require 模块加载

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
