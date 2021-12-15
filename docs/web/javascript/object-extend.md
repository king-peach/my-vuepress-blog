# 继承的多种方式和优缺点

一直以来，对于继承这一块有些一知半解，之前看到红宝书的这部分内容都会发晕，这次看到[冴羽大神](https://github.com/mqyqingfeng/Blog/issues/16)的博客，看完虽然有点懵，但是多少理解了一些，这篇文章内容主要是摘抄。<br />首先说下原型链继承

## 1. 原型链继承

```javascript
function Parent() {
	this.name = 'kevin';
}

Parent.prototype.getName = function() {
	console.log(this.name);
}

function Child() {
	
}

Child.prototype = new Parent();

var child1 = new Child();

console.log(child1.getName()) // kevin
```

问题：引用类型的属性被所有实例共享，举个例子：

```javascript
function Parent() {
  this.names = ['kevin', 'daisy'];
}

function Child() {
	
}

Child.prototype = new Parent();

var child1 = new Child();
child1.name.push('yayu');
console.log(child1.name); // ['kevin', 'daisy', 'yayu']
var child2 = new Child();
console.log(child2.name); // ['kevin', 'daisy', 'yayu']
```

在创建Child实例的时，不能向Parent传参


## 2. 借用构造函数（经典继承）

```javascript
function Parent() {
	this.name = ['kevin', 'daisy'];
}

function Child() {
	Parent.call(this);
}

var child1 = new Child();

child1.name.push('yayu');
console.log(child1.name); // ['kevin', 'daisy', 'yayu']
var child2 = new Child();
console.log(child2.name); // ['kevin', 'daisy']
```

优点：1、避免了引用类型的属性被所有实例共享<br />    2、可以在Child中向Parent传参<br />举例：

```javascript
function Parent(name) {
	this.name = name;
}
function Child(name) {
	Parent.call(this, name);
}

var child1 = new Child('kevin');
console.log(child1.name); // kevin
var child2 = new Child('daisy');
console.log(child2.name); // daisy
```

缺点：方法在构造函数中定义，每次创建实例都会创建一遍方法。

## 3. 组合继承
原型链继承和经典继承双剑合璧

```javascript
function Parent(name) {
	this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function() {
	console.log(this.name);
}

function Child(name, age) {
	Parent.call(this, name);
  
  this.age = age;
  
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

var child1 = new Child('kevin', 18);

child1.colors.push('black');

console.log(child1.name); // kevin
console.log(child1.age); // 18
console.log(child1.colors); // ['red', 'blue', 'green', 'black']

var child2 = new Child('daisy', '20');

console.log(child2.name); // daisy
console.log(child2.age); // 20
console.log(child2.colors); // ['red', 'blue', 'black']
```

优点：融合原型继承和构造函数继承的优点，是Javascript中最常用的继承模式

## 4. 原型式继承

```javascript
function createObj(o) {
	function F() {};
  F.prototype = o;
  return new F();
}
```

这就是ES5 Object.create的模拟实现，将传入的对象作为创建的对象的原型。<br />缺点：<br />包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样

```javascript
var person = {
	name: 'kevin',
  friends: ['daisy', 'kelly']
}

var person1 = createObj(person);
var person2 = createObj(person);

person1.name = 'person1';
console.log(person2.name); // kevin

person1.friends.push('taylor');
console.log(person2.friends); // ['daisy', 'kelly', 'taylor']
```

注意：修改person1.name的值，person2.name的值并未发生改变，并不是因为person1和person2有独立的name值，而是因为person1.name = 'perosn1'，给person1添加了name值，并非修改了原型上的name值。


## 5. 寄生式继承
创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。

```javascript
function createObj(o) {
	var clone = Object.create(o);
  clone.sayName = function () {
  	console.log('hi');
  }
  return clone;
}
```

缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法。


## 6. 寄生组合式继承
为了方便大家阅读，在这里重复以下组合继承的代码：

```javascript
function Parent(name) {
	this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function() {
	console.log(this.name);
}

function Child(name, age) {
	Parent.call(this, name);
  this.age = age;
}

Child.prototype = new Parent();

var child1 = new Child('kevin', '18');

console.log(child)
```

组合继承最大的缺点是会调用两次父构造函数。<br />一次是设置子类型实例的原型的时候：

```javascript
Child.prototype = new Parent();
```

一次在创建子类型实例的时候：

```javascript
var child1 = new Child('kevin', 18);
```

回想下new的模拟实现，其实在这句中，我们会执行：

```javascript
Parent.call(this, name);
```

在这里，我们又会调用一次Parent构造函数。

所以在这个例子中，如果我们打印child1对象，我们会发现Child.prototype和child1都有一个属性为colors，属性值为['red', 'blue', 'green']。<br />那么我们该如何精益求精呢，避免这一次重复调用呢？

如果我们不使用Child.prototype = new Parent(), 而是间接的让Child.prototype访问到Parent.prototype呢？<br />看看如何实现：

```javascript
function Parent（name）{
	this.name = 'name';
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function() {
	console.log(this.name);
}

function Child(name, age) {
	Parent.call(this, name);
  this.age = age;
}

// 关键的第三步
var F = function() {};

F.prototype = Parent.prototype;

Child.prototype = new F();

var child1 = new Child('kevin', '18');

console.log(child1);
```

引用《javascript高级程序设计》中对寄生组合式继承的夸赞就是：<br />这种方式的高效率体现它只调用一次Parent构造函数，并且因此 避免了在Parent.prototype上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用instanceOf和isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。
