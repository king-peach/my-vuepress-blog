# 作用域链

在[变量对象](https://www.yuque.com/wpeach/uqz90h/2019-03-13_3)中提到，当查找变量的时候，会从当前上下文的变量对象中查找，如果没有找到，就会从父级（词法层面的父级）执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局变量。这样由多个执行上下文的变量对象构成的链表就是作用域链<br />在Javascript中，函数的作用域在函数定义的时候就决定了，这是因为函数有一个内部属性[[scope]]，当函数创建的时候，就会保存所有父变量对象到其中，也可以理解为[[scope]]就是所有父变量对象的层级链，但是注意：[[scope]]并不代表完整的作用域链<br />举个例子：

```javascript
function foo() {
	function bar() {
 		...
  }
}
// 函数创建时，各自的[[scope]]为
  foo.[[scope]] = {
  	globalContext.VO
  }
  bar.[[scope]] = {
    fooContext.AO,
  	globalContext.VO
  }
```

当函数激活时，进入函数上下文，创建VO/AO后，就会将活动对象添加到作用域链的前端<br />这时候执行上下文的作用域，我们命名为Scope：

```javascript
Scope = [AO].concat([[Scope]])
```

这时候作用域链就创建完毕了<br />下面由一个例子来分析作用域链的变量对象的创建过程

```javascript
var scope = 'global scope'
function checkscope() {
	var scope2 = 'local scope'
  return scope2
}
checkscope()
```

1、checkscope函数被创建，保存作用域链到内部属性[[scope]]

```javascript
checkscope.[[scope]] = {
	globalContext.VO
}
```

2、执行checkscope函数，创建checkscope函数执行上下文，checkscope函数执行上下文被压入执行上下文栈

```javascript
ECStack = [
	globalContext,
  checkscopeContext
]
```

3、checkscope函数并不立刻执行，开始做准备工作，第一步：复制函数[[scope]]属性创建作用域链

```javascript
checkscopeContext = {
	Scope: checkscope.[[scope]]
}
```

4、用arguments创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明

```javascript
checkscopeContext = {
	AO: {
  	arguments: {
    	length: 0
    },
    scope2: undefined
  },
  Scope: checkscope.[[scope]]
}
```

5、将活动对象压入checkscope作用域顶端

```javascript
checkscopeContext = {
	AO: {
  	arguments: {
    	length: 0
    },
    scope2: undefined
  },
  Scope: [AO, [[scope]]]
}
```

6、准备工作做完，开始执行函数，随着函数的执行，修改AO的属性值

```javascript
checkscopeContext = {
	AO: {
  	arguments: {
    	length: 0
    },
    scope2: 'local scope'
  },
  Scope: [AO, [[scope]]]
}
```

7、查找到scope2的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

```javascript
ECStack.pop()
ECStack = {
	globalContext
}
```


:::tip
本文档内容引用自冴羽大大的博客：[传送门](https://github.com/mqyqingfeng/Blog/issues/6)
:::
