# 一文彻底搞懂 arguments.callee、Function.caller、arguments.caller

callee 和 caller 是和 javaScript 函数相关的两个属性，js 函数内部有一个特殊对象 arguments 用来获取实参类数组，它只有在被调用时才有值。而 arguments 对象包含了 callee 和 caller 这两个属性。

## arguments.callee

`callee`是`arguments`对象的一个属性。它可以用于引用该函数的函数体内正在执行的函数。这在函数名称是未知时很有用，例如在匿名函数内。

::: warning
在严格模式下，ES5 禁止使用`arguments.callee`。当一个函数必须调用自身的时候，避免使用`arguments.callee`，通过使用函数声明或命名函数表达式的方式解决
:::

当我们不得不在匿名函数调用自身时，我们可以这样：

```js
// 非严格模式下
function factory() {
	return function(n) {
		if (n <= 1) return 1;
		return n * arguments.callee(n - 1);
	};
}
factory()(5); // 120 （5 * 4 * 3 * 2 * 1）
```

## Function.caller

`Function.caller`用来返回调用指定函数的函数，如果一个函数`f`是在全局作用域内被调用的，则`f.caller为null`，相反，如果一个函数是在另外一个函数作用域内被调用的，则`f.caller`指向调用它的那个函数。

::: warning
该特性是非标准的，请尽量不要在生产环境使用
:::

这个属性常常被用来检测一个函数的是否被其他函数调用。

```js
// 非严格模式下
function myCall() {
	var message = myCall.caller === null ? '该函数在全局作用域内被调用！' : '调用我的函数是：' + myCall.caller;
	return message;
}

function call() {
	return myCall();
}

call(); // "调用我的函数是：function call() { return myCall(); }"
myCall(); // 该函数在全局作用域内被调用！
```

## arguments.caller

arguments.caller 用于提供调用当前执行函数的函数。

::: danger
需要注意的是,此属性已被删除，不再工作
:::

所以我们不展示它的用法，可以用 arguments.callee.caller 替代，用法如下所示：

```js
// 非严格模式下
function a() {
	var caller = arguments.callee.caller;
	console.log(caller);
}

function b() {
	a();
}

b(); // function b() { a(); }
```

以上三种属性在严格模式下都无法访问，其中 arguments.caller 在非严格模式下访问也为 undefined。

### 参考内容

[1] MDN [arguments.callee](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments/callee)  
[2] MDN [arguments.caller](https://developer.mozilla.org/en-US/docs/Archive/Web/JavaScript/arguments.caller)  
[3] MDN [Function.caller](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/caller)
