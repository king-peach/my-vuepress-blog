# 理解原型和原型链

在javascript中每个对象拥有一个原型对象，所以javascript又被称为基于原型的语言<br />

:::info
原型链就是描述javascript中对象以原型为模版，并从原型对象中继承属性和方法，而原型对象也是从它的原型中继承属性和方法，这样一层一层继承的关系称为原型链。
:::

<br />准确的说用来继承的属性和方法是定义在Object的构造函数的prototype属性上的，而不是对象实例本身<br />通过关系图理解对象原型、构造函数、对象实例之间的关系：<br />
<br />
![prototype5.png](./images/prototype-prototypeChain/img-1.png)<br />如上图所示：_proto_属性已废弃，可以用Object.getPrototypeOf()进行检验。<br />对象原型通过其构造器来给对象实例继承属性和方法而不是直接复制属性和方法、图中蓝线构成原型链<br />每一个javascript对象(除了null)都具有_proto_属性，这个属性会指向对象原型，通过以下代码可以证明：<br />

```javascript
function Person() {
}
person1 = new Person()
// 对象的_proto_方法已弃用，用Object.getPrototypeOf()代替
Object.getPrototypeOf(person1) === Person.prototype // true
```

<br />每个原型都存在一个constructor属性指向其关联的构造函数，代码示例：<br />

```javascript
function Person() {
}
Person === Person.prototype.constructor // true
```

<br />当读取实例的属性时，未找到实例的属性，就会查找该实例的原型中是否存在该属性，若也不存在，则会查找原型的原型中是否存在该属性，以此类推，一直找到顶层为止，代码示例：<br />

```javascript
function Person() {
}
Person.prototype.name = 'john'
var person1 = new Person()
person1.name = 'petter'
person1.name // 'petter'
delete person1.name
person1.name // 'john'
```

<br />原型也是一个对象，通常情况下原型是通过Object()构造函数创建的，那么Object()的原型也就是对象实例原型的原型、而Object的原型的原型就找不到了，为null。null也就是一个空对象。代码示例：<br />

```javascript
Object().getPrototypeOf(Object.prototype) === null // true
```

<br />对象实例也可以用constructor方法，原理是对象实例中不具备constructor方法，但它的原型具备construtor方法，所以。对象实例的constructor方法就是其原型的constructor方法，代码示例：<br />

```javascript
function Person() {
}
var person = new Person()
person.constructor === Person // true
person.constructor === Person.prototype.constructor // true
```

<br />_proto_是非标准的访问对象原型的方法，大部分浏览器仍然可以使用，它并不存在于`Person.prototype`中，而是存在于Object.prototype中，不能算是构造函数的方法，所以用`Object.getPrototypeOf(obj)`取代obj._proto_<br />
<br />理解对象的继承：区别于传统面向对象的语言，javascript中的对象是引用类型，所以对象的继承实际并不是继承属性的值或方法本身而是复制了该属性或方法的引用地址。
