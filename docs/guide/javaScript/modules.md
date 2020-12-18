# CommonJS、CMD、AMD、UMD、ES Modules详解

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

#### 放大模式

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

## ES Module

在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务端，后者用于客户端。ES6 在语言标准层面上，实现了模块功能，而且实现地相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。所以这里ES Module就是ES6的模块

ES6模块 的设计思想是尽量的模块化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时进行分析。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

```js
// CommonJS模块
let { stat, exists, readfile } = require('fs');

// 等价于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```

上面代码的实质是整体加载 fs 模块（即加载 fs 的所有方法），生成一个对象（\_fs），然后再从这个对象上面读取这三个方法。这种加载成为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

ES6模块 不是对象，而是通过`export`命令显式指定输出的代码，再通过`import`命令输入。

```js
// ES6模块
import { stat, exists, readfile } from 'fs';
```

上面的代码实质是从 fs 模块加载 3 个方法，其他方法不加载。这种加载方式成为“编译时加载”或“静态加载”，即 ES6模块 可以在编译时就完成模块加载，效率要比 CommonJS 模块加载的方式高很多。当然这也导致了没法引用 ES6模块 本身，因为它不是对象。

由于 ES6模块 是编译时加载，使得静态分析成为可能。有了它，就能进一步拓宽 JavaScript 的语法，比如引入宏（macro）和类型检查（type system）这些只能靠静态分析实现的功能。

除了静态加载带来的好处，ES6模块 模块还有以下好处。

- 不再需要 UMD 模块格式了，将来服务器和浏览器都会支持 ES6模块 格式。目前，通过工具库已经可以实现这一点了。
- 将来浏览器的新 API 就能用模块格式提供，不再必须做成全局变量或者`navigator`对象的属性。
- 不再需要对象作为命名空间（比如`Math`对象），未来这些功能可以通过模块提供

ES6模块 自动采用严格模式，不管你有没有在模块头部加上`"use strict"`。

#### 严格模式

严格模式主要有以下限制：

- 变量必须声明后使用
- 函数的参数不能有同名属性，否则报错
- 不能使用`with`语句
- 不能对只读属性赋值，否则报错
- 不能使用前缀 0 表示八进制数，否则报错
- 不能删除不可删除的属性，否则报错
- 不能删除变量`delete prop`，会报错，只能删除属性`delete global[prop]`
- `eval`不会在它的外层作用域引入变量
- `eval`和`arguments`不能被重新赋值
- `arguments`不会自动反映函数参数的变化
- 不能使用`arguments.caller`
- 不能使用`arguments.callee`
- 禁止`this`指向全局对象
- 不能使用`fn.caller`和`fn.arguments`获取函数调用的堆栈
- 增加了保留字（比如`protected`、`static`和`interface`）

上面这些限制，ES6模块 都必须遵守。其中，尤其需要注意的是`this`的限制。ES6 模块之中，顶层的`this`指向`undefined`，即不应该在顶层作用域中使用`this`。

#### ES6模块的用法

ES6模块功能主要由两个命令构成：`export`和`import`。`export`命令用于规定模块的对外接口，	`import`命令用于输入其他模块提供的功能。

##### export 命令

一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用`export`关键字输出该变量。下面是一个JS文件，里面使用`export`输出变量
```js
// variable.js
export var name = 'module';
export var value = '1';
export var description = 'this is a module file';

// module.js
var name = 'module';
var value = '1';
var description = 'this is a module file';

export { name, value, description };
```
上面代码中module.js文件和variable.js写法是等价的，module.js的写法可以在模块底部清晰的表示模块输出变量。  

`export`命令除了输出变量，还可以输出函数或类(class)。

```js
export function add(x, y) {
	return x + y;
};
```

通常情况下`export`关键字对外输出的就是变量的名字，当然我们也可以通过`as`关键字进行输出变量重命名。

```js
function v1() { ... }
function v2() { ... }

export {
	v1 as func1,
	v2 as func2,
	v2 as variable2
};
```
上面代码中，通过`as`关键字，重命名了`v1`和`v2`的对外接口，并且`v2`可以用不同的名字输出。

需要特别注意的是，`export`规定的是对外的接口，必须与模块内部的变量建立一对一的关系。

```js
// 报错
export 1; // 1是值不是接口

// 报错
var m = 1;
export m; // 输出的不是接口

/* 正确的写法如下*/
// 写法一
export var m = 1;

// 写法二
var m = 1;
export { m };

// 写法三
var m = 1;
export { m as n };
```
`export`语句输出的接口，与其对应的值是动态绑定关系，即通过接口，可以取到模块内部实时的值。

```js
export var foo = 'bar';

setTimeout(function() {
	foo = 'baz';
}, 5000);
```

上述代码输出的变量foo为`bar`，五秒以后变成`baz`。这点与CommonJS完全不同，CommonJS输出的是值的缓存。  
`export`可以出现在模块的任何位置，只要处在模块顶层就可以。如果处于块级作用域内，就会报错，下一节的`import`命令也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了ES6模块的设计初衷。

```js
function foo() {
	export default 'bar'; // SyntaxError export语句不能放在函数中
};
foo();
```

##### import 命令

使用`export`命令定义了模块的对外接口以后，其他JS文件就可以通过`import`命令加载这个模块。

```js
// main.js
import { name, value, description } from './module.js';

function cons() {
	return 'this is ' + name + '; this\'s value is ' + value + '; this\' description is ' + description;
};
```
上面代码中，`import`命令接受一对大括号，里面指定要从其他模块导入的变量名，大括号里面的变量名，必须与被导入模块`module.js`对外输出的接口名称一致。

`import`命令要使用`as`关键字，将输入的变量重命名。

```js
import { name as newName } from './module.js';
```

`import`命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里改写接口。

```js
import { a } from './lib.js';

a = {}; // Syntax Error: 'a' is read-only
```

上面的代码中，脚本加载了变量`a`，对其重新赋值就会报错。因为`a`是一个只读变量，但是，修改`a`的属性值是可以的。

```js
import { a } from './lib.js';

a.name = 'a'; // 修改成功
```

上面代码中，`a`的属性可以成功改写，并且其他模块也可以读到改写后的值。不过，这种写法很难查错。建议输入的变量，完全当作只读，不要随意修改它的属性。  

`import`后面的`from`指定模块文件的位置，可以是相对路径，也可以是绝对路径。如果不带有路径，只是一个模块名，那么必须有配置文件，告诉javaScript引擎该模块的位置。如下所示：

```js
import { method } from 'utils'; // utils需要进行配置
```
注意，`import`具有提升效果，会提升到模块头部，首先执行。

```js
foo();

import { foo } from 'modules';
```

上面的代码不会报错，因为`import`的执行早于`foo`的调用。这种行为的本质是，`import`命令是编译阶段执行的，在代码执行之前。  

由于`import`是在静态执行的，所以引入的时候不能使用表达式和变量和`if`结构。在静态分析阶段，这些语法都是没法得到值的。

最后，`import`语句会执行所加载的模块，因此可以直接引入模块：

```js
import 'lodash';

import 'lodash';
```
上面的代码加载了两次`lodash`，但是只会执行一次。

##### 模块的整体加载

除了指定的输出指定的值，还可以整体加载，即用`*`注定一个对象，所有输出值都加载在这个对象上面。

```js
import * as module from './module';

console.log('this module\'s name is' + module.getName());
```

注意，模块的整体加载所在的那个对象，应该是可以静态分析的，所以不允许运行时改变。下面的写法都不允许。
```js
import * as module from './module';

// 下面两行都是不允许的
module.name = 'mod';
module.method = function() {};
```

##### export default命令
为了让用户不用去查询模块的内容，直接加载该模块，就要用到`export default`命令，为该模块指定默认输出：

```js
// module.js
export default function() {
	// ...
};

// main.js
import utils from './module';
utils();
```

上面代码的`import`命令，可用任意名称指向`module.js`输出的方法，这时就不需要知道原模块输出的函数名。需要注意的是，这时`import`命令后面，不使用大括号。当然`export default`也可以输出非匿名函数，输入的时候也是可以任意命名的。

`export default`命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此`export default`命令只能使用一次。所以，`import`命令后面才不用大括号，因为只可能唯一对应`export default`命令。

本质上，`export default`就是输出一个叫做`default`的变量和方法，然后系统允许你为它取任意名字。所以，下面的写法是有效的。

```js
// module.js
function add(x, y) {
	return x + y;
};
export { add as default }; // 等同于 export default add

// main.js
import { default as add } from './module'; // 等同于 import { add } from './module';
```

正是因为`export default`命令其实只是输出一个`default`变量，所以它后面不能跟变量声明语句。

```js
// 正确
export var  a = 1;

// 正确
var a = 1;
export default a;

// 错误
export default var a = 1;
```

上面代码中，`export default a`的含义是将变量`a`赋值给变量`default`。所以，最后一种写法会报错。  

如果想在一条`import`语句中同时输默认方法和其他接口，可以写成下面这样：

```js
// module.js 
export default function(obj) {
	// ...
};

export function each() {
	// ...
};

export { each as forEach };

// import.js
import _, { each, forEach } from './module';
```

上面代码的最后一行的意思是，暴露出`forEach`接口，默认指向`each`接口，即`forEach`和`each`指向同一个方法。

##### export与import的复合写法

如果一个模块之中，先输入后输出同一个模块

```js
export { foo, bar } from 'modules';

// 等价于
import { foo, bar } from 'modules';
export { foo, bar };
```
需要注意的是，第一种写法不能在当前模块中使用引入变量，这里只是将变量转发了，并没有引入。  

模块的接口改名和整体输出、默认接口的写法，也可以采用这种写法：

```js
// 接口改名
export { foo as bar } from 'modules';

// 整体输出
export * from 'modules';

// 默认接口
export { default } from 'modules';
```

具名接口改为默认接口的写法


```js
export { es6 as default } from 'modules';

// 等同于
import { es6 } from 'modules';
export default es6;

// 默认接口改为具名接口
export { default as es6 } from 'modules';
```

在ES2020之前，还有一种`import`语法没有对应的复合手法，[ES2020](https://github.com/tc39/proposal-export-ns-from)补上了这个写法。

```js
// ES2020之前
import * as module from 'modules';
export { module };

// ES2020
export * as module from 'modules';
```

##### 跨模块常量

当我们在开发应用时，很多情况下面临着常量复用，我们可以将这些常量放在一个公共模块里进行管理，这是就可以应用ES6的模块方法

```js
// constant.js
export const A = 'a';
export const B = 'b';
export const C = 'c';

// main.js
import { A, B, C } from './constant';
```

当我们的项目比较大时，为了目录结构清晰，可以分多文件进行常量管理，这时候可以在一个模块中统一输出

```js
// constantA.js
export const A = 'a';
// constantB.js
export const B = 'b';

// /constant/index.js
export * from './constantA';
export * from './constantB';

// 使用时
import { A, B } from './constant/index';
```

##### 动态加载

因为`import`命令会被javaScript引擎静态分析，先于模块内的其他语句执行。所以，当我们想要动态引入模块时，就会引发错误。比如条件加载模块

```js
if (arr instanceof Array) {
	import { isArray } from './utils';
}; // 报错
```

上面代码中，引擎处理`import`语句是在编译时，这时不会去分析或执行`if`语句，所以`import`语句放在`if`代码块之中毫无意义，因此会报句法错误，而不是执行时错误。也就是说，`import`和`export`语句只能在模块的顶层，不能在代码块之中。

[ES2020](https://github.com/tc39/proposal-export-ns-from)引入了`import()`函数，支持模块动态加载`import(specifier)`。`import`函数的参数`specifier`，指定所要加载的模块的位置。`import`命令能够接受什么参数，`import()`函数就能接受什么参数，两者区别主要是后者为动态加载。 

`import()`返回一个Promise对象。下面是一个例子：
```js
import('/constant/index')
	.then(constants => {
		console.log(constants)
	})
	.catch(err => console.log(err));
```

`import()`函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是运行时执行。`import()`函数与所加载的模块没有静态连接关系，这点也是与`import`语句不同。  

下面是`import()`的一些适用场合
1. 按需加载
	`import()`可以在需要的时候，再加载某个模块。

	```js
	button.addEventListener('click', function() {
		import('./modules')
			.then(module => {
				console.log(module)
			})
			.catch(err => {
				console.log(err)
			})
	}, false)
	```

	上面的代码中，`import()`方法放在`click`事件的监听函数之中，只有用户点击了按钮，才会加载这个模块。

2. 条件加载
	`import()`可以放在`if`代码块，根据不同的情况，加载不同的模块：
	
	```js
	if (condition) {
		import('./moduleA').then()
	} else {
		import('./moduleB').then()
	}
	```

3. 动态的模块路径
	`import()`允许模块路径动态生成
	
	```js
	import(getRouter())
		.then(...);
	```

	上面代码根据getRouter函数的返回结果来加载不同的模块。  

如果想同时加载多个模块，可以采用下面的写法：

```js
Promise.all([
	import('moduleA.js'),
	import('moduleB.js'),
	import('moduleC.js')
])
	.then(([moduleA, moduleB, moduleC]) => {
		console.log(moduleA, moduleB, moduleC);
	})
	.catch(err => console.log(err));
```

`import()`也可以用在async函数中

```js
async function main() {
	const myModule = await import('./moduleA.js');
	const { export1, export2 } = await import('./myModule.js');
	const [module1, module2, module3] = await Promise.all([
		import('./moduleA.js'),
		import('./moduleB.js'),
		import('./moduleC.js')
	]);
}
main();
```


#### ES6模块加载

##### 浏览器加载

ES6 Module的加载有分为浏览器端和服务端  
浏览器加载ES6模块时，使用`<script>`标签，加入`type="module"`属性：
```html
<script type="module" src="./module.js"></script>
```
上面代码在网页中插入一个模块`module.js`，由于`type`属性设为`module`，所以浏览器知道这是一个ES6模块。
浏览器对于带有`type="module"`的脚本，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，等同于打开了`<script>`标签的`defer`属性。
```html
<script type="module" src="./module.js"></script>
<!-- 等价于 -->
<script type="module" src="./module.js" defer></script>
```
如果页面出现多个`<script type="module">`时，它们会按照在页面出现的顺序执行。  
`<script>`标签的`async`属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后，再恢复渲染。  
`上面的defer和async的区别是：defer要等到整个页面在内存中正常渲染结束，才会执行；async一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。一句话，defer是渲染完再执行，async是下载完再执行。另外，如果有多个defer脚本，会按照它们在页面出现的顺序加载，而多个async是不能保证加载顺序的`  

`<script>`标签的`async`属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后，再恢复渲染。
```html
<script type="module" src="./module.js" async></script>
```
一旦使用了async模块，`<script type="module">`就不会按照在页面出现的顺序执行，而是只要该模块加载完成，就执行该模块。  

ES6模块也允许内嵌在网页中，语法行为和加载外部脚本基本一致。
```html
<script type="module">
	import module from './module.js';

	// ...
</script>
```
值得注意的是，在模块的顶层作用域中，`this`不指向全局变量`this === undefined`可以利用这个特性判断当前是否在ES6模块环境中

##### ES6模块和CommonJS差异
讨论Node.js加载ES6模块之前，必须了解ES6模块与CommonJS模块完全不同。

它们有三个重大差异。
- CommonJS模块输出的是一个值的拷贝，ES6模块输出的是值的引用
- CommonJS模块是运行时加载，ES6模块是编译时输出接口。
- CommonJS模块的`require()`是同步加载模块，ES6模块的`import`命令是异步加载，有一独立的模块依赖的解析阶段。

对于这些差异的具体表现我就不一一阐述了，感兴趣的可以查看[ECMAScript6 入门](https://es6.ruanyifeng.com/#docs/module-loader)

##### Node.js的模块加载方式

javaScript现在有两种模式，一种是ES6模块，简称ESM；另一种是CommonJS模块，简称CJS。  

CommonJS模块是Node.js专用的，与ES6模块不兼容。语法上，两者最明显的差异是，CommonJS模块使用`require()`和`module.exports`，ES6模块使用`import`和`export`。

它们采用不同的加载方案。从Node.js v13.2版本开始，Node.js已经默认你打开了ES6模块支持。  

Node.js要求ES6模块采用.mjs后缀文件名。也就是说只要脚本文件里面使用`import`和`export`命令，那么必须采用`.mjs`后缀名。Node.js遇到`.mjs`文件就认为它是ES6模块，默认启用严格模式，不必在每个模块文件顶部指定`'user strict'`。  

如果不希望将后缀名改成`.mjs`，可以在项目的`package.json`文件中，指定`type`字段为`module`。

```json
{
	"type": "module"
}
```

一旦设置了以后，该目录里面的JS脚本，就被解释用ES6模块。

```shell
# 解释成 ES6 模块
$ node module.js
```
如果这时还要使用CommonJS模块，那么需要将CommonJS脚本的后缀名改为`.cjs`。如果没有`type`字段，或者`type`字段为`commonjs`，则`.js`脚本都会被解析成CommonJS模块。  

总结来说就是：`.mjs`文件总是以ES6模块加载，`.cjs`文件总是以CommonJS模块加，`.js`文件的加载取决于`package.json`里面的`type`字段的值

`package.json`文件有两个可以指定模块的入口文件：`main`和`exports`，`exports`优先级高于`main`，[更多配置](https://es6.ruanyifeng.com/#docs/module-loader)

##### CommonJS模块加载ES6模块

CommonJS的`require()`不能加载ES6模块，会报错，只能使用`import()`方法加载。
```js
(async() => {
	await import('./modules.js');
})();
```
上面代码可以在CommonJS模块中运行。

`require()`不支持ES6模块的一个原因是，它是同步加载，而ES6模块内部可以使用顶层`await`命令，导致无法被同步加载。

##### ES6模块加载CommonJS模块

ES6模块的`import`命令可以加载CommonJS模块，但是只能整体加载，不能只加载单一的输出项。

```js
// 正确
import module from './module.js';

// 报错
import { method } from './module.js';
```

这是因为ES6模块需要支持静态代码分析，而CommonJS模块的输出接口是`module.exports`，是一个对象，无法被静态分析，所以只能整体加载。

加载单一的输出项，可以写成下面这样。

```js
import module from './module.js';
const { method } = module;
```

还可以这样写，使用Node.js内置的`module.createRequire()`方法。

```js
// cjs.cjs
module.exports = 'cjs';

// esm.mjs
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const cjs = require('./cjs.cjs');
cjs === 'cjs'; // true
```

上面代码中，ES6模块通过`module.createRequire()`方法可以加载CommonJS模块。但是，这种写法等于将ES6和CommonJS混在一起了，所以不建议使用。

### 参考内容

[1] ruanyifeng， [Javascript 模块化编程（一）：模块的写法](http://www.ruanyifeng.com/blog/2012/10/javascript_module.html)<br/>
[2] 合肥懒皮， [模块(一) CommonJs,AMD, CMD, UMD](https://www.jianshu.com/p/33d53cce8237)  
[3] ruanyifeng，[Javascript 模块化编程（三）：require.js 的用法](http://www.ruanyifeng.com/blog/2012/11/require_js.html)  
[4] ruanyifeng，[ECMAScript 6 入门： Module 的语法](https://es6.ruanyifeng.com/#docs/module)
