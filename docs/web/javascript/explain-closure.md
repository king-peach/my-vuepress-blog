# 理解闭包

闭包的含义：函数和声明其函数的词法环境的组合<br />闭包示例：<br />一、运用函数式编程实现类似单一对象方法场景，闭包允许将函数与其操作的数据(环境)关联起来，<br />一个简单的改变字号的函数示例：

```javascript
function changeFontSize(size) {
	reutrn function() {
  	document.querySelector('body').style.fontSize = size + 'px'
  }
}
var size12 = changeFontSize(12)
var size14 = changeFontSize(14)
var size16 = changeFontSize(16)
```

二、用闭包模拟私有方法。javascript原生没有提供私有方法的实现方式，我们可以使用闭包来模拟私有方法  私有方法不仅仅有利于限制对外代码的访问、还提供了管理全局命名空间的能力，避免非核心的方法污染代码的公共接口部分。模块模式就是典型的闭包模拟私有方法、示例：

```javascript
function Counter() {
	var privateCounter = 0
  function changeBy(val) {
  	privateCounter += val
  }
  return {
  	increament: function() {
    	changeBy(1)
    },
    decreament: function() {
    	changeBy(-1)
    },
    value: function() {
    	console.info(privateCounter)
    }
  }
}
var counter1 = Counter()
var counter2 = Counter()
console.info(counter1.value()) // 0
counter1.increament()
console.info(counter1.value()) // 1
counter1.decreament()
console.info(counter1.value()) // 0
console.info(counter2.value()) // 0
```

以上代码中，Counter()函数创建了一个词法环境为三个函数共享：Counter.increament、Counter.decreament、Counter.value。这个词法环境中包含了两个私有项：privateCounter变量和changeBy方法。这两个方法无法在外部进行访问，必须通过Counter函数暴露出的三个方法去访问。所以说这三个公共方法共享同一个环境的闭包。以上的counter1和counter2都是独立执行的不会影响其中的私有变量和方法

三、循环中创建闭包出现的问题和解决方案<br />先看一个简单的示例：

```javascript
// 在循环中给数组赋值，实现的正常方式
function box() {
	var arr = [];
  for (var i = 0; i < 5; i++) {
  	arr[i] = i
  }
  return arr
}
box() // [0, 1, 2, 3, 4]
// 当在循环中放入一个闭包函数时
function box() {
	var arr = [];
  for (var i = 0; i < 5; i++) {
  	arr[i] = function() {
    	return i
    }
  }
  return arr
}
box() // 执行五次匿名函数本身 [f(), f(), f(), f(), f()]
box()[0] // 第一次执行匿名函数本身
box()[0]() // 执行第一次匿名函数并访问第一次循环的闭包中私有变量 5
```

问题，以上循环中的匿名函数中return 一个i，这个i在匿名函数的闭包中找不到，只能去上下文执行环境中查找，最后找到了i是循环中的i，此时的i是循环后的i，所以是5.如果要每次循环执行时输出当前循环的i，需要解决的将i作为参数传递进匿名函数并且立即执行。解决示例：

```javascript
// 通过匿名函数的自执行来取当前循环的i值并输出
function box() {
	var arr = [];
  for (var i = 0; i < 5; i++) {
    arr[i] = (function(index) {
    	return index
    })(i)
  }
  return arr
}
box() // [0, 1, 2, 3, 4]
// 在匿名函数自执行时赋值给一个变量，这个自执行的匿名函数的括号可以去掉
function box() {
	var arr = []
  for (var i = 0; i < 5; i++) {
  	arr[i] = function(index) {
    	return index
    }(i)
  }
  return arr
}
box() // [0, 1, 2, 3, 4]
```
 <br />闭包的性能考量：如果不是某些特定场景需要用到闭包，应该避免使用闭包，因为闭包在处理速度和内存消耗方面是对脚本性能有负面影响、在创建新的对象和类时，方法应该关联于对象的原型而不是定义到构造函数中，这样会导致每次构造器被调用时，方法都会执行一遍消耗性能<br />冴羽大神对于闭包的理解是：闭包是指那些能够访问自由变量的函数。而自由变量是指在函数中使用的，但既不是函数参数也不是函数的局部变量的变量。（闭包 = 函数 + 函数能够访问的自由变量）

```javascript
var a = 1;
function foo() {
  console.log(a);
}
foo();
```

上述示例中，foo函数可以访问变量a，但a既不是foo函数的局部变量，也不是foo的参数，所以a是自由变量<br />理论上来说foo + foo函数能访问的变量构成了一个闭包。<br />所以在《javascript权威指南》中提到：从技术层面将，任何函数都是闭包。<br />ECMAScript给出了更加详尽的解释：<br />1、理论角度：所有的函数，因为它们都在创建的时候就将上层上下文的数据保存起来了，哪怕是最简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域<br />2、实践角度：以下函数才算是闭包：<br />i：即使创建它的上下文已经销毁，它仍然存在（比如：内部函数从父函数返回）<br />ii：在代码中引用了自由变量<br />首先来看一个示例：

```javascript
var scope = 'global scope';
function checkscope() {
	var scope = 'local scope';
  function f() {
  	console.info(scope)
  };
  return f;
}
var foo = checkscope();
foo();
```

我们通过执行上下文和执行上下文栈的变化情况来分析一下这段代码的执行过程（看不懂得先看下这篇[文章](https://www.yuque.com/wpeach/uqz90h/2019-03-13_2)）：<br />1、进入全局代码，创建全局执行上下文，全局执行上下文被压入执行上下文栈<br />2、全局执行上下文初始化<br />3、执行checkscope函数，创建checkscope函数执行上下文，checkscope执行上下文被压入执行上下文栈<br />4、checkscope执行上下文初始化，创建变量对象、作用域链、this等<br />5、checkscope函数执行完毕，checkscope执行上下文从执行上下文栈中弹出<br />6、执行f函数，创建f函数执行上下文，f函数执行上下文被压入执行上下文栈<br />7、f执行上下文初始化，创建变量对象、作用域链、this等<br />8、f函数执行完毕，f函数上下文从执行上下文栈中弹出<br />了解到这个过程我们应该思考一个问题：当f函数执行的时候，checkscope函数上下文已经被销毁（从执行上下文栈中弹出），那为何还能读取checkscope作用域下的scope值呢。<br />以上代码要是换成PHP，就会报错。因为在PHP中，f函数只能读取到自己作用域和全局作用域里的值，所以读不到checkscope函数作用域的值<br />但是在Javascript这段代码确实可行的。当我们了解具体的执行过程后，我们知道f执行上下文维护了一个作用域链：

```
fContext = {
	Scope: [AO, checkscopeContext.AO, globalContext.AO]
}
```

就是因为这个作用域链，f函数依然能读取到checkscopeContext.AO的值，说明f函数引用了checkscopeContext.AO中的值的时候，即使checkscopeContext.AO被销毁，但是Javascript依然会让checkscopeContext.AO存在于在内存中，f函数依然可以通过f函数的作用域链找到它，正是Javascript实现了这一点，从而实现了闭包。<br />接下来来看一道经典的面试题：

```javascript
var data = [];
for (var i = 0; i < 3; i++) {
	data[i] = function() {
  	console.info(i);
  }
}
data[0](); // 3
data[1](); // 3
data[2](); // 3
```

让我们来分析一下原因：当执行到data[0]函数之前，此时全局上下文的VO为：

```javascript
globalContext = {
	VO: {
  	data: [...],
    i: 3
  }
}
// data[0]的作用域链为
data[0]Context = {
	Scope: [AO, globalContext.VO]
}
```

因为从data[0]的执行上下文中并没有i值，所以从globalContext.VO中查找，i为3，所以打印的结果也为3<br />当我们将这个函数改成闭包看下

```javascript
var data = [];
for (var i = 0; i < 3; i++) {
	data[i] = (function(i) {
  	return function() {
    	console.info(i);
    }
  })(i);
}
data[0](); // 0
data[1](); // 1
data[2](); // 2
```

当执行到data[0]函数之前还是跟之前的执行上下文一样，但是此时的data[0]的作用域链发生了变化：

```javascript
data[0]Context = {
	Scope: [AO, 匿名函数Context.AO, globalContext.AO]
}
// 匿名函数变量对象为
匿名函数Context = {
	AO: {
  	arguments: {
    	0: 0,
      length: 1
    },
    i: 0
  }
}
```

data[0]Context.AO中并没有i值，所以会沿着作用域链从匿名函数Context.AO中查找，这时候就会找到i为0，一次类推data[1]、data[2]函数的执行结果。<br />将之前示例的声明关键字改成let，又有啥变化呢：

```javascript
var data = [];
for (let i = 0; i < 3; i++) {
	data[i] = function() {
  	console.info(i)
  }
}
data[0](); // 0
data[1](); // 1
data[2](); // 2
```

这里我们引用[《你不知道的javascript》](https://blog.csdn.net/qq_38021852/article/details/82756068)中的解释：let关键字将for循环的块隐式地声明为块级作用域，而for循环头部的let不仅将i绑定到了for循环的块中，事实上它将其重新绑定到了循环的每一个迭代中，确保使用上一个循环迭代执行结束 时的值重新进行赋值。<br />简单说来let关键字将for循环声明成了一个作用域也拥有了执行上下文，并且每次循环迭代结束后对i重新赋值。所以data[0]能从for循环的块级作用域中找到i。此时data[0]的执行上下文为：

```javascript
data[0]Context = {
	Scope: [AO, for循环块级作用域Context.AO, globalContext.AO]
}
// for循环块级作用域Context.AO
for循环块级作用域Context.AO = {
	AO: {
  	arguments: {
    	0: 0,
      length: 1
    },
    i: 0
  }
}
```

:::tip
此文档引用字冴羽大神的博客：[传送门](https://github.com/mqyqingfeng/Blog/issues/9)
:::
