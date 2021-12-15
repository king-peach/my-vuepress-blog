# 从ECMAScript规范中解读this

首先说下this的定义，this是函数作用域中的一个关键字，在ECMAScript规范中实在这么解释this的：`this 关键字执行为当前执行环境的 ThisBinding`。换句话说就是它用来指向调用此函数的对象。<br />ECMAScript分为语言类型和规范类型<br />ECMAScript语言类型是开发者直接使用ECMAScript可以操作的，也就是七种基本类型：String、Number、Null、Undefined、Boolean、Object、Symbol（es6新增基本类型）<br />ECMAScript规范类型相当于meta-value，是用算法来描述ECMAScript语言类型的。规范类型包括：Reference、List、Completion、Property Descriptor、Property Identifier，Lexical Environment、Environment Record<br />这其中Reference跟this的指向有密切的联系<br />Reference：在ECMAScript标准中被描述为a resolve name binding （已完成的命名绑定）<br />那javascript解析器是如何去解析this的呢，ECMAScript的官方描述如下：

```

1. Let ref be the result of evaluating MemberExpression.

2. Let func be GetValue(ref).

3. Let argList be the result of evaluating Arguments, producing an internal list of argument values (see 11.2.4).

4. If Type(func) is not Object, throw a TypeError exception.

5. If IsCallable(func) is false, throw a TypeError exception.

6. If Type(ref) is Reference, then

    a.If IsPropertyReference(ref) is true, then
    i.Let thisValue be GetBase(ref).

    b. Else, the base of ref is an Environment Record
    i.Let thisValue be the result of calling the Implicit This Value concrete method of GetBase(ref).

7. Else, Type(ref) is not Reference.

    a.Let thisValue be undefined.

8. Return the result of calling the [[Call]] internal method on func, providing thisValue as the this value and providing the list argList as the argument values.
```

这八句话啥意思呢，其实我也想知道😂、不过我找到一张图来解释这八句话，图示：<br />
![167cec74a1455c7b.jpg](https://cdn.nlark.com/yuque/0/2019/jpeg/192449/1552561876073-c4734105-85c7-44eb-96e2-1d9fc22d4c2c.jpeg#align=left&display=inline&height=1121&name=167cec74a1455c7b.jpg&originHeight=1615&originWidth=1075&size=89302&status=done&width=746)<br />这张图将解析的每一个步骤进行了分析。红色指代关键的步骤，如果第三步`getValue(ref)`得出的结果无法通过第五步的判断的话，也就是`getValue(ref)`不是一个对象，那this指向毫无意义，此时编译器会抛出类型异常<br />第二步：计算MemberExpression的值并且赋给Ref：也就是计算（）左边内容的结果，并赋值给Ref<br />第六步：判断Ref是否为Reference类型<br />第七步：判断ref是否是属于引用类型：官方解释：通过执行`IsPropertyReference(V)`来判断，如果base value是个对象或`HasPrimitiveBase(V)`是true，那么返回true，否则返回false。`HasPrimitiveBase(V)`：如果base value是Boolean、Number、String，那么返回true。也就是ref这个引用是基于哪个对象。如果是基于一个对象或者Boolean、String、Number那就返回true，否则返回false。<br />
<br />由于base value和`IsPropertyReference`都是和Reference有关系的，所以来详细解释一下Reference的构成：<br />官方的解释比较复杂，简化来说就是Reference有三个组成部分，分别是：<br />1、base value<br />2、reference name<br />3、strict reference<br />
<br />其中base value就是属性所在的对象或者就是`EnvironmentRecord`，它的值只可能是undefined、Object、Boolean、String、Number、environment record其中的一种。而且规范中还提供了获取Reference组成部分的方法，比如`GetBase`和`IsPropertyReference`。<br />1、GetBase：返回Reference的base value<br />2、IsPropertyReference：如果base value是一个对象，就返回true

```javascript
var foo = {
	bar: function() {
  	return this
  }
}
foo.bar() // foo
// bar对应的Reference是：
var barReference = {
	base: foo, // base value
  propertyName: 'bar',
  strict: false
}
```

GetValue：返回对象真正的值，而不是获取Reference。上面例子中`getValue(barReference) = function() { return this }`。<br />针对具体使用场景进行分析：<br />1、直接调用<br />

```javascript
let a = 'm'
function test() {
	console.info(this.a)
}
```

根据图中步骤进行分析：<br />一、test()的Ref就是test的引用<br />二、判断test是否为引用类型，返回true<br />三、判断Ref是否是属性引用类型，返回false，因为它并没有定义在某个引用类型内部，也就是不是对象的属性<br />四、进入到第九步：`this => ImpliciThisValue(Ref)`，在Environment Record都返回undefined，而非严格模式会将undefined指向window对象<br />
<br />2、在对象内部调<br />

```javascript
function test() {
	console.info(this.a)
}
let parent = {
	a: 's',
  test: test
}
parent.test() // s
```

根据图中步骤进行分析：<br />一、test()的Ref是parent.test的引用<br />二、判断parent.test是否为引用类型，返回true<br />三、判断Ref是否为属性引用类型，返回true<br />四、进入到第八步GetBase(Ref)是parent，所以this指向parent<br />
<br />3、构造函数new一个新对象<br />

```javascript
let a = 'm'
function Foo() {
	console.info(this)
}
let c = new Foo()
c.a = 's'
```

new 关键字的调用区别于一般的函数调用<br />一、一个继承自Foo.prototype的新对象被创建<br />二、使用指定的参数调用构造函数Foo，并将this绑定到新创建的对象<br />
<br />4、箭头函数的this指向（待探索）<br />

:::tip
本文档内容引用自：[dendoink的掘金文](https://juejin.im/post/5c1c5bfcf265da614c4cc40e)、[冴羽的博客](https://github.com/mqyqingfeng/Blog/issues/7)
:::
