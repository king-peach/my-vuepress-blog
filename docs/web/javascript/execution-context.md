# 执行上下文

当Javascript执行一段可执行代码时，会创建对应的执行上下文<br />对于每个执行上下文，都有三个重要属性：<br />1、变量对象<br />2、作用域链<br />3、this<br />之前三篇文章对于这三部分都有讲解。我们用一段代码来进行分析<br />

```javascript
var scope = 'global scope'
function checkscope = {
	var scope = 'local scope'
  function f() {
  	return scope
  }
	return f()
}
checkscope() // local scope
```

执行过程如下：<br />1、执行全局代码，创建全局上下文，全局上下文被压入全局上下文栈

```javascript
ECStack = [
	globalContext
]
```

2、全局上下文初始化

```javascript
golbalContext = {
	VO: [global],
  Scope: [globalContext.VO],
  this: globalContext.VO
}
```

2、初始化的同时，checkscope函数被创建，保存作用域链到函数的内部属性[[scope]]

```javascript
checkscope.[[scope]] = {
	globalContext.VO
}
```

3、执行checkscope函数，创建checkscope函数执行上下文，checkscope函数执行上下文被压入执行上下文栈中

```
ECStack = [
	checkscopeContext,
  globalContext
]
```

4、checkscope函数执行上下文初始化：<br />一、赋值函数[[scope]]属性创建作用域<br />二、用arguments创建活动对象<br />三、初始化活动对象，即加入形参、函数声明、变量声明<br />四、将活动对象压入checkscope作用域链顶端<br />同时f函数被创建，保存作用域链到f函数的内部属性[[scope]]

```javascript
checkscopeContext = {
	AO: {
  		arguments: {
      	length: 0
      }，
      scope: undefined,
      f: reference to function f() {}
  },
  Scope: [AO, globalContext.VO],
  this: undefined
}
```

5、执行f函数，创建f函数执行上下文，f函数执行上下文被压入执行上下文栈

```javascript
ECStack = [
	fContext,
  checkContext,
  globalContext
]
```

6、f函数执行上下文初始化 ，以下跟第四步相同：<br />一、复制函数[[scope]]属性创建作用域链<br />二、用arguments创建变量对象<br />三、初始化活动对象，即加入形参、函数声明、变量声明<br />四、将活动对象压入f作用域链顶端

```javascript
fContext = {
	AO: {
  	arguments: {
    	length: 0
    }
  },
  Scope: [AO, checkscopeContext.AO, globalContext.VO],
  this: undefined
}
```

7、函数执行，沿着作用域链查找scope值，返回scope值<br />8、f函数执行完毕，checkscope执行上下文从执行上下文栈中弹出

```javascript
ECStack = [
	globalContext
]
```

:::tip
本文档引用自冴羽大神的博客：[传送门](https://github.com/mqyqingfeng/Blog/issues/8)
:::
