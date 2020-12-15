# CommonJS/CMD/AMD/UMD/ES Modules 的区别和用法

## 前端模块化

可能看到 CMD、AMD、ES Modules 这些名词你有点陌生，所以在介绍这些概念之前，先说一下前端模块化。模块化是一种编程思想，也是一个伟大的实践，几乎所有语言都有其模块化的实践，javaScript 也不例外，在 javaScript 发展初期，开发人员们只是拿它完成一些简单的页面交互。随着 ajax 技术的出现，web 技术开始蓬勃发展，用户已经不满足于简单的页面交互，web 应用也越来越复杂，这代码量自然而然就大了起来。糟糕的是 javaScript 是一门弱类型语言，没有命名空间等一些严谨的程序设计，所以开发者面临复杂的应用往往感到头大，这时候前端工程化就显得尤为必要了，慢慢的开发者开始研究怎么复用代码以及防止全局变量污染等一系列骚操作，于是 CMD、AMD、ES Modules 这些前端模块化库应运而生...
当我们遇到复杂项目往往遇到的问题有：
::: tip

1. 命名空间：所有文件的方法都是挂载到 global 对象上，会污染全局环境，并且需要考虑命名冲突的问题
2. 依赖问题：js 文件的是顺序加载的， 如果个文件之间有依赖关系，那我们必须考虑 js 文件的加载顺序
3. 网络问题：如果项目引入的文件很多时，请求的次数也会增多，同样页面的渲染时间也会增加，影响性能

:::

在 javaScript 的官方模块化方案没出现之前，还出现了一些解决上述问题的方法，比如利用函数表达式，对象，立即执行函数，伪造命名空间等方式来达到模拟模块化的目的，这些方式的具体实现方式如下

#### 原始写法

模块就是实现特定功能的一组方法，只要把不同的函数简单的放在一起，就算是一个模块。

```js
function module_1() {
	//...
}

function module_2() {
	//...
}
```

上面的函数 module_1 和 module_2，组成一个模块，直接调用就行，这种方法存在明显的确定就是全局污染，无法保证不与其他模块发送命名冲突，而且成员之间看不出直接关系

#### 对象写法

为了解决命名冲突的问题，可以把模块写成一个对象，模块方法都放进对象中。

```js
var modules = {
	_count: 0,
	module1: function() {
		//...
	},
	module2: function() {
		//...
	},
};
```

这样通过调用对象的属性，就可以实现模块调用，但是缺点也很明显，上述对象中的\_count 属性可以被外部改写：`modules._count = 1` 存在一定的隐患。
其实这种写法在 ES5 中又叫命名空间，参考[JS 命名空间](https://www.jianshu.com/p/554454d951d9)
命名空间的示例如下:

```js
var MYNAMESPACE = MYNAMESPACE || {};

MYNAMESPACE.person = function(name) {
	this.name = name;
};

MYNAMESPACE.person.prototype.getName = function() {
	return this.name;
};

// 使用方法
var name1 = new MYNAMESPACE.person('one');
name1.getName(); // one
```

在 javaScript 模块化方案没有出现之前，命名空间是一个非常棒的实践，用于避免全局变量污染以及用于组织代码模块的逻辑性，拓展性，可读性和可维护性。

#### 立即执行函数

使用立即执行函数（IIFE）可以达到不暴露私有成员的目的

```js
var modules = (function() {
  var _count = 0;
  module1: function() {
		//...
	};
	module2: function() {
		//...
  };

  return {
    module1,
    module2
  };
})();
```

使用上述方法，外部无法改写其私有成员，这也就是模块的初级写法，下面我们再对该方法进行加工

### 放大模式

如果一个模块很大，必须分成几个部分，或者模块需要继承。这时就有必要采用 “放大模式”

```js
var modules1 = (function(mod) {
	mod.func1 = function() {
		// ...
	};

	return mod;
})(modules1);
```

上述方法为 module1 添加了一个新的方法 func1，并返回了该模块

#### 宽放大模式

在浏览器环境中，我们可能不知道是否获取到需要的模块，这时上述代码可能会报错，所以我们需要判断是否存在，不存在时将方法写入一个新的模块。

```js
var modules1 = (function(mod) {
	mod.func1 = function() {
		//...
	};

	return mod;
})(window.modules1 || {});
```

这就是宽放大模式，可以将方法写入空对象

#### 输入性全局变量

独立性是模块的重要特点，模块内部最好不要与程序的其他部分直接交互。为了在模块内部用全局变量，必须显式地将其他变量输入模块。

```js
var modules = (function($, YAHOO) {
	//...
})(JQuery, YAHOO);
```

上面的 modules 模块需要 JQuery 库和 YUI 库，就把这两个库当作参数输入 modules。这样做除了保证模块的独立性，还使得模块之间依赖关系变得明显。

## CommonJS

CommonJS 出现的背景是 js 没有完善的模块系统。标准库较少，缺少包管理工具。在 node.js 兴起以后，服务端的代码趋于庞大，这时候 js 模块化显得尤为必要，CommonJS 应运而生。node.j 是 CommonJS 的最佳实践者。他有四个重要的环境变量为模块化提供支持：

1.  **_module_**：代表当前模块，具有 {id, filename, loaded, parent, children, exports }这些属性，具体的含义参考：[CommonJS 规范](https://javascript.ruanyifeng.com/nodejs/module.html#toc0)。
2.  **_exports_**：为了方便，node 为每个模块提供了一个 exports 变量，指向 module.exports，等同于  
    `var exports = module.exports`。
3.  **_require_**：用于加载模块文件。该变量的基本功能是读入并执行一个 JavaScript 文件，然后返回该模块的 exports 对象，如果没有发现指定模块则报错。
4.  **_global_**：全局变量，用于在多模块间共享变量，慎用。

#### CommonJS 使用方法：

```js
/* 暴露模块 */
module.exports = {};
exports = {}; // 等价于 var exports = module.exports

/* 引入模块 */
var mod = require('xxx');

/* 全局变量 */
global.params1 = 'xxx';
```

#### CommonJS 规范

- 一个文件就是一个模块，拥有单独作用域；
- 普通方式定义的变量、函数、对象属于该模块内；
- 通过 require 来加载模块；
- 通过 module.exports 或者 exports 来暴露模块中的内容；

#### 注意事项

- 当 module.exports 和 exports 同时存在时，module.exports 会覆盖 exports;
- 当模块内全都是 exports 时，其实就等同于 module.exports;
- exports 其实就是 module.exports 的子集；
- 所有代码都是运行在模块作用域，不会污染全局环境
- 模块可以被多次加载，但是只会出现一次，因为 node 会缓存模块，以后再加载模块时，直接从缓存中取出该模块的 module.exports 属性
- 模块加载的顺序是按照代码出现的顺序同步加载的
- \_\_dirname 代表当前模块所在的文件路径
- \_\_filename 代表当前模块文件所在的文件路径 + 文件名

CommonJS 以同步的方式加载模块，在服务端，模块文件存储在本地磁盘，读取会非常快。所以这样做不会有问题。但是在浏览器端，由于网路的限制，同步加载可能会阻塞应用渲染，这样体验很差，所以浏览器端更适合用异步加载的方式，所以就产生了 AMD 规范。

## AMD && require.js

[AMD (Asynchronous Module definition)](https://github.com/amdjs/amdjs-api/wiki/AMD) 指定定义模块的机制，以便可以异步加载模块及其依赖项。这特别适合于同步加载模块会带来性能、可用性、调试和跨域访问问题的浏览器环境。避免了模块加载阻塞网页的渲染进度。
AMD 作为一个规范，只需要关心其语法 API，而不关心实现。AMD 规范简单到只有一个 API，即 define 函数  
`define([module-name?], [array-of-dependencies?], [module-factory-or-object]);`

- **_module-name_**：模块标识，可以省略
- **_array-of-dependencies_**：所依赖的模块，可以省略
- **_module-factory-or-object_**： 模块的实现，或者一个 javaScript 对象，回调函数

define 函数具有异步性。当 define 函数执行时，首先会异步的去调用第二个参数中列出的依赖模块，当所有的模块被载入完成以后，如果第三个参数是一个回调函数则执行；然后告诉系统模块可用，也就通知了依赖于自己的模块自己可用。  
目前主要有两个 javaScript 库实现了 AMD 规范： [request.js](https://requirejs.org/) 和 [curl.js](https://github.com/cujojs/curl)。这里主要通过介绍 require.js，进一步讲解 AMD 的用法，以及如何将模块化投入实战。

#### require.js

require.js 的诞生，是为了解决浏览器加载多文件的页面阻塞和模块依赖项加载的顺序问题。

##### require.js 的加载

首先下载 [require.js](http://requirejs.org/docs/download.html) 到本地或者通过 cdn 引入的方式加载[require.js](https://cdn.bootcdn.net/ajax/libs/require.js/2.3.6/require.js)。
如果是下载的，假定将他放入 js 子目录下引入:

```html
<script src="/js/require.js"></script>
```

如果担心引入这个文件造成页面渲染阻塞，可以将引入脚本置于 body 底部，或者写成异步加载的方式，如下所示：

```html
<script src="/js/require.js" defer async="true"></script>
```

async 属性表明这个文件是需要异步加载的，避免网页失去响应。IE 不支持这个属性，只支持 defer，所以把 defer 也写上。
加载 javaScript 以后，下一步就要加载我们的模块了，假定我们写了一个模块文件是 main.js，也放在 js 目录下，那么只需要写成下面这样就行：

```html
<script src="/js/require.js" data-main="/js/main"></script>
```

data-main 属性的作用，是网页程序的主模块。在上例中，就是 js 目录下的 main.js，这个文件会第一个被 require.js 加载。由于 require.js 默认的文件后缀名是 js,所以可以把 main.js 简写成 main。

main.js，我们称之为“主模块”，意思是整个网页的入口代码。它有点像 C 语言的 main()函数，所有代码都从这儿开始运行。下面就来看，怎么写 main.js。  
如果我们的代码不依赖任何其他模块，那么我们可以直接写入 javaScript 代码。

```js
// main.js
alert('加载成功');
```

但是这样的话，就没必要使用 require.js 了。真正常见的情况是，主模块依赖于其他模块，这时就要使用 AMD 规范定义的 require()函数。

```js
require(['moduleA', 'moduleB'], function(moduleA, moduleB) {
	// do something
});
```

require()函数接收两个参数。第一个参数是一个数组，表示所依赖的模块，上例就是['moduleA', 'moduleB']， 即主模块依赖这两个模块；第二个人参数是一个回调函数，当前面指定的模块都加载成功后，它将被调用。加载的模块会以参数的形式传入该函数，从而在回调函数内部使用这些模块。
require()函数加载 moduleA、moduleB 模块时，网页不会失去响应；它指定的回调函数，只有前面的模块都加载成功后，才会运行，解决了依赖性的问题。
require()还可以自定义引入模块的变量名，main.js 可以这样写：

```js
require(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	// do something
});
```

require.js 会先加载 jQuery、underscore、backbone，然后再运行回调函数，主模块的代码就写在回调函数中。

当我们的依赖项放在不同的目录下时，可以使用 require.config()方法来自定义模块加载，require.config()就写在主模块(main.js)的头部。参数就是一个对象，这个对象的 paths 属性指定各个模块的加载路径：

```js
require.config({
	paths: {
		jquery: '/js/jquery-min.js',
		underscore: '/js/underscore-min.js',
	},
});

require(['jquery', 'underscore'], function($, _) {
	// do something
});
```

如果所有的依赖文件都有一个共同的基目录，可以使用 require.config.baseUrl 属性，示例如下：

```js
require.config({
	baseUrl: '/js',
	paths: {
		jquery: 'jquery-min.js',
		underscore: 'underscore-min.js',
	},
});

require(['jquery', 'underscore'], function($, _) {
	// do something
});
```

当 main.js 的配置了解了的话，我们来了解一下模块文件的写法。require.js 加载的模块，采用的 AMD 规范，也就是说必须按照 AMD 的规范来写。  
具体来说，就是模块必须采用特定的 define()函数来定义。如果一个模块不依赖其他模块，那么可以直接定义在 define()函数之 中。  
假定现在有一个 moduleA 模块，那么这个模块就要这么写：

```js
/* moduleA.js */
define(function() {
	var add = function(a, b) {
		return a + b;
	};
	return {
		add: add,
	};
});
```

加载方法如下：

```js
/* main.js */
require(['moduleA'], function(moduleA) {
	console.log(moduleA.add(1, 2));
});
```

如果 moduleA 还依赖其他模块，应该这么写：

```js
/* moduleA.js */
define(['lib'], function(lib) {
	var add = function(a, b) {
		return a + lib.parse(b);
	};
});
```

当 moduleA 模块加载时，就会先加载 lib 模块。

当需要加载非 AMD 规范的模块时，我们需要采取不一样的配置方法，举例来说，underscore 和 backbone 这两个库，都没采用 AMD 规范编写，如果要加载它们的话，必须先定义它们的特征。

```js
require.config({
	shim: {
		underscore: {
			exports: '_',
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone',
		},
	},
});
```

require.config()接受一个配置对象，这个对象除了有前面说过的 paths 属性之外，还有一个 shim 属性，专门用来配置不兼容的模块。具体来说，每个模块要定义:

1. exports 值（输出的变量名）,表明这个模块外部调用时的名称；
2. deps 数组，表明该模块的依赖项

## CMD

CMD 是另一种模块化方案，它和 AMD 很类似，不同点在于：AMD 推崇依赖前置，提前执行，而 CMD 推崇依赖就近，延迟执行，这个规范其实就是 sea.js 推广过程产生的。

因为 CMD 推崇一个文件一个模块。因此经常会用文件名作为模块 ID，CMD 推崇依赖就近，所以一般不在 define 的参数中写依赖，而是在 factory 中写：  
`define(id, deps, factory) factory：function(require, exports, module) {}`

- **require**：factory 的第一个参数，用来获取其他模块提供的接口
- **exports**：一个对象，用来向外提供模块接口
- **module**：一个对象，上面存储了与前模块相关联的一些属性和方法

```js
// 定义没有依赖的模块
define(function(require, exports, module) {
	exports.xxx = value;
	module.exports = value;
});

// 定义有依赖的模块
define(function(reqire, exports, module) {
	var modules1 = require('./module1.js');
	require.async('./module.js', function(m2) {
		// do something
	})
	export.xxx = value
});

// 引入模块
define(function(require, exports, module) {
	const m1 = require('./module1.js');
	m1.show();
});
```

## UMD

UMD 是一个整合了 CommonJS 和 AMD 规范的方法。希望能实现一种通用模块化的解决方案  
运行原理：

- UMD 会先判断是否支持 Node.js 的模块（export）是否存在。存在则使用 CommonJS 的模块加载方式
- 当 CommonJS 的模块不存在时，在判断是否存在支持 AMD 规范的环境，存在则使用 AMD 方式加载模块

示例如下：

```js
(function(window, factory) {
	if (typeof exports === 'object') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define(factory);
	} else {
		window.eventUtil = factory();
	}
})(this, function() {
	// do something
});
```

### 参考内容

[1] ruanyifeng， [Javascript 模块化编程（一）：模块的写法](http://www.ruanyifeng.com/blog/2012/10/javascript_module.html)<br/>
[2] 合肥懒皮， [模块(一) CommonJs,AMD, CMD, UMD](https://www.jianshu.com/p/33d53cce8237)  
[3] ruanyifeng，[Javascript 模块化编程（三）：require.js 的用法](http://www.ruanyifeng.com/blog/2012/11/require_js.html)
