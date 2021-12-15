# 花上几个小时学习Dart，为Flutter打好基础

虽然`Flutter`官网说学习上手`Flutter`并不需要刻意学习`Dart`语言 ，当你碰到不懂的地方再开始回头来看`Dart`语法。但是当我搭建好环境后，练习[Flutter中文网](https://flutterchina.club/)的demo时，还是有些吃力，或许是我的语言天赋太差了，亦或者是我的编程基础太差了。所以我决定从头开始学习`Dart`。这样看起`flutter`代码来才能事半功倍。<br />相信准备学习`Flutter`的开发者们，应该都有多年的编程从业经验了吧，所以我不打算细致的讲解`Dart`内容，我之前是一位Web开发者，对于`javaScript`比较熟悉，所以这篇文章我主要从`Dart`和`javaScript`不同的地方去剖析。
<a name="NHnSn"></a>
## 一、Hello Dart
学习任何一门语言都是从"Hello World!"开始，那我们也从这开始吧。
<a name="AvTI0"></a>
### 1. Hello World
首先打开我们比较熟悉的编译器，新建一个helloWorld.dart，打开并输入下面这一串代码
```dart
main(List<String> args) {x
	print('Hello World!');
}
```
然后在终端中输入`dart helloWorld.dart`，就能看到“hello world”的结果了。
<a name="8atMA"></a>
###  2. 语法解析
针对上面的那一段代码进行简单的解释，也 由此总结下写`Dart`需要注意什么：

1. `main()` 函数是`Dart`语言的入口函数，也是必不可少的
1. `Dart`的入口函数`main()`是没有返回值的
1. 传递给`main()`函数的命令行参数，是通过`List`完成的，其中`List`是`Dart`的集合类型
1. 定义字符串的时候，可以使用单引号或者双引号
1. 每行语句必须使用分号结尾，对象类型的数据中以逗号分割且最后一个属性也要带上逗号
<a name="8Irjr"></a>
## 二、定义变量和常量
Dart语言集合了强类型和弱类型语言的特点，既可以制定类型也可以使用泛型。听起来是不是很牛逼 的样子 ，走着...
<a name="GdVaT"></a>
### 1. 制定类型
指定类型也就是明确声明变量，格式如下：
```dart
变量类型 变量名称 =  赋值
```
示例代码如下：
```dart
String temp = 'value'; // 字符串类型
int number = 111; // 整数类型
double float = 12.0; // 浮点型
print('$temp $number $float'); // 打印多个变量，使用单引号包括，${...}或者$...的方式表示变量
```
需要注意的是，定义的变量可以赋值 ，但是不可以赋值其他 类型的值
```dart
String temp = 'Hello World';
temp = 'yeap'; // yeap
temp = 123; // 发生错误，不能赋值非字符串的值
```
<a name="sF63d"></a>
### 2. 类型推到
类型推导声明变量的方式如下：
```dart
var/dynamic/final/const 变量名称 = 赋值
```
其中`dynamic`是可以在变量定义以后赋值不同类型的值的，所以通常情况下不使用`dynamic`定义变量，容易造成潜在的危险；`final`和`const`用来定义常量，定义后不能进行二次赋值。下面我们来看看他们的用法吧：
```dart
/* var */
var temp = '123';
temp = 'xxx';
print('$temp ${temp.runtimeType}'); // xxx String   需要注意的是，runtimeType方法可以用来或许该变量或常量的类型
temp = 123; // 报错，var不能赋值其他类型值

/* dynamic */
dynamic danger = 'abc';
danger = 123;
print('$danger ${danger.runtimeType}'); // 123 int

/* const */
const one = 1;
print('$one ${one.runtimeType}'); // i int
one = '111'; // 报错，变量不能进行二次赋值

/* final */
final temp = 1;
print('$temp ${temp.runtimeType}'); // 1 int
final _temp = () => return 'get value';
final timestamp = new DateTime.now();
print('$_temp ${_temp.runtimeType} $timestamp'); // get value Closure: () => String () => String 时间戳
// final 可以在编译阶段赋值，也就是说可以赋值函数和表达式
```
<a name="zq1Q2"></a>
## 三、数据类型
`dart`的数据包括数字类型、布尔类型、字符串类型和集合类型
<a name="krWjv"></a>
### 1. 数字类型
数字类型主要包括整数类型（int）和浮点数类型（double），需要说明的是`Dart`的`int`和`double`主要取决于`Dart`的运行环境，其主要的用法如下所示：
```dart
// 整数类型
int number = 11;
int _number = 0x1B;
print('$number $_number'); // 11 27

// 浮点数类型
double height = 1.80;
print(height); // 1.8

// 数字转字符串
int age = 25;
var str = age.toString();
var num2str = age.toStringAsFixed(2);
print('$age $str $num2str'); // 25 25 25.00
print('${age.runtimeType} ${str.runtimeType} ${num2str.runtimeType}'); // int String String

// 字符串转数字
var num = '22';
var num2Int = int.parse(num);
var num2Double  = double.parse(num);
print('$num $num2Int $num2Double'); // 22 22 22.0
print('${num.runtimeType} ${num2Int.runtimeType} ${num2Double.runtimeType}'); // String int double
```
<a name="Tt0GT"></a>
### 2. 布尔类型
布尔类型大致和js一样，但是`dart`的判断语句不能使用隐式转换，也就是说，**Dart中不能使用!0 即真或!''即真。**
```dart
// boolean
var flag = true;
print('$flag ${flag.runtimeType}');

// 条件语句
/* 正确写法 */
if (flag) {
	// ... 
}

/* 错误写法 */
var str = 'message';
if (str) {
	print('this is true');
}
```
<a name="GbBA0"></a>
### 3. 字符串类型 
Dart字符串是UTF-16编码单元的序列，使用方法和js类似，**需要注意的是多行字符串的使用方法需要用到''',**<br />需要用到字符串拼接时，使用`${=expression}`表示，当拼接字符串和标识符时可以省略{}，直接使用`$variable`
```dart
// String
var str = 'this is a single string';
var _str = "this is a single string";
var multiline  = '''first line
			secone line
      third line''';
print('$str $_str $multiline'); // this is a single string this is a single string first line
 //                       secone line
 //     third line

// 字符串拼接的方式在上面 实例中都有展示
var name = 'jack';
var age = 24;
print('he is $name, his age is $age, his name type is ${name.runtimeType}'); // he is jack, his age is 24, his name type is String
```
<a name="TPbXt"></a>
### 4. 集合类型
<a name="DZxCh"></a>
### 1. 集合类型的定义
Dart中常用的集合类型为**List/Set/Map**<br />它们的定义分别是这样的
```dart
/* List 定义 */
// 1. 使用类型推导定义
var letters = ['a', 'b', 'c', 'd'];
print('$letters ${letters.runtimeType}'); // [a, b, c, d] List<String>

// 2. 明确指定类型
List<String> list = ['message', 'abc'];
print('$lsit ${list.runtimeType}'); // [message, abc] List<String>

/* Set 定义 (List和Set的区别是，Set是无序的，且其中的元素是不重复的) */
// 1. 使用类型推导定义
var lettersSet = {'a', 'b', 'c'};
print('$lettersSet ${lettersSet.runtimeType}'); // {a, b, c} _CompactLinkedHashSet<String>

// 2. 明确制定类型定义
Set temp = {1, 2, 3, 4};
print('$temp ${temp.runtimeType}'); // {1, 2, 3, 4} _CompactLinkedHashSet<dynamic>

/* Map 定义 Map定义元素是一组键值对 */
// 1. 使用类型推导定义
var map1 = { 'name': 'jack', age: 22 };
print('$map1 ${map1.runtimeType}'); // {name: jack, 24: 22} _InternalLinkedHashMap<dynamic, Object>

// 2. 明确指定类型定义 (键和值的类型只能按照约定类型来定义, Object可以定义字符串和数字类型)
Map<String, Object> document = { 'head': '<head></head>', 'text': 123};
  print('$document ${document.runtimeType}'); // {head: <head></head>, text: 123} _InternalLinkedHashMap<String, Object>
```
<a name="HaUHh"></a>
### 2. 集合类型的常见操作
所有集合都支持获取长度的属性`length` ：
```dart
// 获取集合的长度
List<String> list = ['message', 'abc'];
Set temp = {1, 2, 3, 4};
Map<String, Object> document = { 'head': '<head></head>', 'text': 123};
print(list.length); // 2
print(temp.length); // 4
print(document.length); // 2

/* List的增加/删除/包含方法 */
list.add('add a lsit');
print(list); // [message, abc, add a lsit]

list.remove('abc'); // 根据元素删除
print(list); // [message, add a lsit]
list.removeAt(1); // 根据索引值删除, 索引值从0开始
print(list); // [message]

print(list.contains('message')); // true

/* Map集合的操作，Map可以针对键值或者其中的一项进行操作，所以方法相对来说多一些 */
Map<String, Object> map1 = { 'name': 'jack', 'age': 22 };
// 1. 根据Key获取value
print(map1['name']);

// 2. 获取所有的entries
print('${map1.entries} ${map1.entries.runtimeType}'); // (MapEntry(name: jack), MapEntry(age: 22)) MappedIterable<String, MapEntry<String, Object>>

// 3. 获取所有的keys
print('${map1.keys} ${map1.keys.runtimeType}'); //  (name, age) _CompactIterable<String>

// 4. 获取所有的values
print('${map1.values} ${map1.values.runtimeType}'); // (jack, 22) _CompactIterable<Object>

// 5. 判断是否包含某个Key和value
print('${map1.containsKey('name')} ${map1.containsValue(22)}'); // true true

// 6. 根据key删除元素
map1.remove('age');
print(map1); // {name: jack}
```


<a name="YqUmL"></a>
## 四、函数
Dart是一种面向对象的语言，所以即使函数也是对象，所以也有类型，函数类型是Function，**函数是一等公民**，这也就意味着函数可以作为变量定义或者作为其他函数的参数或者返回值.<br />函数的定义：
```dart
返回值类型 函数的名称(参数列表) {
	函数体
  return 返回值
}
```
按照上面定义，我们实现一个完整函数：
```dart
int sum(num sum1, num sum2) {
	return sum1 + sum2;
}

// 其中函数返回值的类型定义是可以省略的
sum(num sum1, num sum2) {
	return sum1 + sum2;
}

// 如果函数只有一个表达式也可以写成箭头函数的形式
sum(num1, num2) => num1 + num2;
```
`Dart` 函数和js中比较大的区别是，该函数的可选参数分为**位置可选函数（用[]表示）**和**命名可选参数（用{}表示）。**<br />**定义方式：**
```dart
命名可选参数：{param1, param2, ...}
位置可选参数：[param1, param2, ...]
// 需要注意的是命名可选参数和位置可选参数不能同时使用 
```
可选参数的示例，如下所示：
```dart
// 命名可选参数
person(String name, {int age, double height }) {
	print('my name is $name, my height is $height, $age years old this years!');
};
person('jack', age: 22); // my name is jack, my height is null, 22 years old this years!

// 位置可选参数
person(String name, [ int age, double height ]) {
  print('my name is $name, my height is $height, $age years old this years!');
};
person('jack', 22); // my name is jack, my height is null, 22 years old this years!
```
可选参数还可以指定默认值，需要注意的是**必须参数不能指定默认值**，可选参数默认值在定义变量后用等号连接，如下所示：
```dart
person(String name, { int age = 25, double height  = 1.80 }) {
	print('my name is $name, my height is $height, $age years old this years!');
};
person('nick'); // my name is nick, my height is 1.8, 25 years old this years!
```
`Dart`中函数的作用域和闭包使用方法和js类似，不同的是`Dart`中函数的返回值是一定存在的，默认值为`null`，隐式附加到函数体：
```dart
main(List<String> args) {
	print(foo()); // this is a Function   null
};

foo() {
	print('this is a Function');
};
```


<a name="Q7DDZ"></a>
## 五、运算符
`Dart`中运算符相对来说 多一些，就不一一进行总结了 ，只针对相对于js不同的地方进行举例说明，这些运算符可能看起来有点不习惯，但是很大的方便了我们的开发。
<a name="UdKYi"></a>
### 数值整除、取整、取模

<br />`var num = 7;`<br />`print(num / 2); // 3.5 `<br />`print(num ~/ 2); // 3 `<br />`print(num % 2); // 1`<br />

<a name="iPnv0"></a>
### ??=赋值操作
`？？=`这个操作符比较神奇，可以取代js中的三目运算符，而且代码也没那么冗长，首先解释下他的用法：

- 当变量为`null` 时，使用后面的值来赋值
- 当变量有值时，使用前面的值来赋值
```dart
mian(List<String> args) {
	var name = 'dart';
  var name1 = null;
  name1 ??= name;
  print(name1);  // dart
}
```
<a name="raGPD"></a>
### 条件运算符
`expr1 ？？pxpr2` 这就是dart中的条件运算符，他的用法是：

- 如果`expr1` 是 `null` ，则返回 `expr2` 的结果
- 如果 `expr1` 不是 `null` ，则直接使用`expr1`的值
```dart
var temp = 'dart';
var name = temp ?? 'no value';
var str = null;
var name1 = str ?? 'no value';
print('this name is $name, this name1 is $name1'); // this name is dart, this name1 is no value
```
<a name="na0Mx"></a>
### 级联语法
有些时候需要对一个类进行连续操作，这个时候可以使用级联语法：
```dart
class Person() {
	String name;
  
  void run() {
  	print('$name is running');
  }
  
  void eat() {
  	print('$name is eating');
  }
  
  void say() {
  	print('Hi! $name');
  }
};

main(List<String> args) {
	final p1 = new Person();
  p1.name = 'jack';
  p1.run(); // jack is running
  p1.eat(); // jack is eating
  p1.say(); // Hi! jack
  
  final p2 = new Person()
    .name = 'nick'
    .run() // nick is running
    .eat() // nick is eating
    .say(); // Hi! nick
}
```


<a name="ojTun"></a>
## 六、流程控制
`dart` 的流程控制和js基本类似，需要注意的是其中的`if/else`语句中的判断条件只能为`boolean`类型。<br />

<a name="Ncldb"></a>
## 七、类和对象
`Dart` 是一个面向对象的语言，面向对象中非常重要的概念就是类，类产生了对象<br />

<a name="fo39F"></a>
### 1. 类的定义
定义类使用`class关键字`，类通常有两部分组成：成员(member)和方法(method)。<br />定义的伪代码：
```dart
class 类名 {
	类型 成员名;
  返回值类型 方法名(参数列表) {
  	方法体
  }
}
```
编写一个简单的Person类：

- 需要注意的是：在方法体内使用成员变量时，不需要加`this`;
- 当成员变量存在命名冲突 时，`this`不能省略
- 创建实例对象时，`new`关键字可以省略（dart version >= 2.0）
```dart
class Person() {
	String name;
  
  eat() {
  	print('$name is eating');
  };
};

main(List<String> args) {
	var p1 = new Person() // ==> var p1 = Person()
  	.name = 'jack';
  	.eat(); // jack is eating
};
```
<a name="EvlmY"></a>
### 2. 构造方法
<a name="AJFIz"></a>
#### 2.1 普通构造方法
当通过类创建一个对象时，会调用这个类的构造函数。

- 当类中没有明确的指定构造方法时，将默认拥有一个无参的构造方法
- 上面的Person中就是在调用这个构造方法

我们也可以根据自己的需求自定义构造方法：

- 当有了自己的构造方法时，默认的构造函数会失效，不能使用。**当然，你可能希望明确的写一个默认的构造方法 ，但是会和我们自定义的构造方法冲突；这是因为Dart本身不支持函数的重载【名称相同，参数不同的方式】**
- 示例实现toString方法：
```dart
class Person() {
  String name;
  int age;
  
  Person(String name, int age) {
  	this.name = name;
    this.age = age;
  }
  
  @override String toString() {
  	return 'name = $name, age = $age';
  };
};
```
在实现构造方法时，通常做的事就是通过参数给属性赋值，为了简化这一过程，Dart提供了语法糖简化这一过程：
```dart
Person(String name, int age) {
	this.name = name;
  this.age  = age;
}

// 等价于
Person(String name, int age);
```
<a name="r547q"></a>
#### 2.2 命名构造方法
在开发中，我们确实希望实现更多的构造方法，怎么办呢？<br />**因为不支持函数（方法）的重载，所以我们没办法创建相同名称的构造方法**<br />需要使用**命名构造函数：**
```dart
class Person() {
	String name;
  int age;
  
  Person() {
  	name = '';
    age = 0;
  }
  
  // 命名构造方法
  Person.withArguments(String name, int age) {
  	this.name = name;
    this.age = age;
  };
  
  @override 
  String toString() {
  	return 'name = $name, age = $age';
  };
};

// 创建对象
var p1 = new Person();
print(p1); // name = , age = 0
var p2 = new Person.withArguments('teacher', 22);
print(p2); // name = teacher, age = 22
```
<a name="zMwqw"></a>
#### 2.3 重定向构造函数
在某些情况下，传入相同值时，希望返回同一个对象，这个时候可以使用常量构造方法。默认情况创建对象时，即使传入相同的参数，创建出来的也不是同一个对象
