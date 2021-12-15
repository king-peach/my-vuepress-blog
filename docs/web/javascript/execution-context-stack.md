# 执行上下文栈

要理解执行上下文栈首先要理解执行上下文，在javascript中有三种类型的可执行代码，它们分别是：全局代码、函数代码、eval代码。当浏览器解析到这些可执行代码时需要进行一些“准备工作”，而这些准备工作就可以理解为执行上下文。而执行上下文栈呢就是将可执行的执行上下文一个个添加进一个栈中，这个栈可以理解为一个类数组的数据结构，当执行一段函数时，就会创建一个执行上下文，并将其加入执行上下文栈中，当函数执行完毕的时候，就会将这个执行上下文弹出。<br />为了模拟执行上下文栈的数据结构，我们可以将其当成一个数组ECStack，而全局函数呢就定义为一个globalContext，ECStack始终先添加globalContext，请看一下一段示例：

```javascript
function fun3() {
}
function  fun2() {
	fun3()
}
function fun1() {
	fun2()
}
function fun() {
	fun1()
}
fun()
// 将其用执行上下文栈表示为
// global
ECStack = [
	globalContext
]
// 调用fun
ECStack.push(`<fun>` functionContext)
// fun中调用了fun1
ECStack.push(`<fun1>` functionContext)
// fun1中又调用了fun2
ECStack.push(`<fun2>` functionContext)
// fun2中又调用了fun3
ECStack.push(`<fun3>` functionContext)
// fun3执行完毕
ECStack.pop()
// fun2执行完毕
ECStack.pop()
// fun1执行完毕
ECStack.pop()
// fun执行完毕
ECStack.pop()
 // global执行完毕
ECStack.pop()
```

接着静态作用域与动态作用域中的思考中用执行上下文的进行分析

```javascript
var scope = 'global'
function foo(){
    var scope = 'local'
    function bar(){
        return scope;
    }
    return bar()
}
foo()
// 执行上下文解析
ECStack.push(`<foo>` functionContext)
ECStack.push(`<bar>` functionContext)
ECStack.pop()
ECStack.pop()
```

```javascript
var scope = 'global'
function foo(){
    var scope = 'local'
    function bar(){
        return scope;
    }
    return bar
}
foo()()
// 执行上下文解析
ECStack.push(`<foo>` functionContext)
ECStack.pop()
ECStack.push(`<bar>` functionContext)
ECStack.pop()
```

说明函数的执行顺序不同。说到javascript的执行顺序，是自上而下的吗，请看一段代码

```javascript
var foo = function() {
	console.info('foo1')
}
foo() // foo1
var foo = function() {
	console.info('foo2')
}
foo() // foo2
```

```javascript
function foo(){
	console.info('foo1')
}
foo() // foo2
function foo() {
	console.info('foo2')
}
foo() // foo2
```

从上面两端代码可以看出。第一段是变量提升，第二段是函数提升，为何产生不一样的效果呢？

:::tip
本资料内容引用自冴羽大神的博客：[传送门](https://github.com/mqyqingfeng/Blog/issues/4)
:::
