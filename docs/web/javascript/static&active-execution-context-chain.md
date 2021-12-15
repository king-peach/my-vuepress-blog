# 静态作用域链和动态作用域链

作用域是指程序源代码中定义变量的区域<br />作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限<br />作用域分为静态作用域和动态作用域，而静态作用域也称为词法作用域，javascript采用的是词法作用域<br />作用域判别机制：<br />词法作用域：函数的作用域基于函数定义时的作用域<br />动态作用域：函数的作用域基于函数调用时的作用域<br />通过一个简单的示例进行分析：

```javascript
var foo = 1
function bar() {
	console.info(foo)
}
function baz() {
	var foo = 2
  bar()
}
baz() // 1
```

根据以上代码，词法作用域的原理是调用baz函数时，执行了bar，bar中没有局部变量foo，所以去上一层作用域查找，而它的上一层作用域为全局作用域，此时的foo = 1，所以打印出1。<br />动态作用域的执行原理是，调用baz，baz中又调用了bar，此时bar在baz中调用，作用域为baz，bar中没有局部变量foo，所以往上一层作用域中查找，它的上一层作用域在baz中，所以foo=2。

思考两段代码

```javascript
var scope = 'global'
function foo() {
	var scope = 'local'
  function bar() {
  	console.info(scope)
  }
  return bar()
foo() // 'local'
var scope = 'global'
function foo() {
	var scope = 'local'
  function bar() {
  	console.info(scope)
  }
  return bar;
}
foo()() // 'local'
```

两个函数定义的位置都是同一位置。所以作用域相同。但是这两个函数有什么不同之处呢？

:::tip
本资料内容引用自冴羽大神的博客：[传送门](https://github.com/mqyqingfeng/Blog)
:::
