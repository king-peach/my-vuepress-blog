# 9 个超级强大的 javaScript 技巧

所谓 hacker 方法，就是一种不断改进和迭代的构建方法。有着 hacker 精神的程序员相信事物总有改进的余地，没有什么是完美的存在。每一段代码都有进一步优化的空间，每一个操作都有更便捷的技巧。

下面列举一些 hacker 技巧

#### 1. Replace All

我们知道 String.Replace()函数只会替换第一个匹配的项目。  
你可以在这个正则表达式的末尾添加/g 来替换所有内容。

```js
var str = 'phone phone';
console.log(str.replace(/pho/, 'go')); // gone phone
console.log(str.replace(/pho/g, 'go')); // gone gone
```

#### 2. 提取唯一值

我们使用 Set 和 Spread(拓展)运算符，创建一个剔除重复值的新数组。

```js
var entries = [1, 2, 3, 2, 4, 1];
var temp = [...new Set(entries)];
console.log(temp); // [1, 2, 3, 4]
```

#### 3. 将数字转换成字符串

我们可以利用 javaScript 的隐式转换来实现数字快捷转换成字符串

```js
var num = 5;
var temp = num + '';
console.log(temp, typeof temp); // 5 string
```

#### 4.将字符串转换成数字

我们可以使用 javaScript 的隐式类型转换，+value => Number(value), 我们列举一下常见数据 类型的转换规则：

```js
// Boolean
console.log(+true); // 1
console.log(+false); // 0

// Number
console.log(+2); // 2

// null || undefined
console.log(+undefined); // NaN
console.log(+null);
0;

// String
console.log(+''); // 0
console.log(+'111'); // 111
console.log(+'asdasdas'); // NaN
console.log(+'12.3aaaa'); // NaN

// Object || Array
console.log(+[]); // 0
console.log(+{}); // NaN
console.log(+function() {}); //NaN
```

这里主要解释一下字符串类型的转换，+运算符会将字符串转换成十进制数，忽略前面的 0（16 进制除外），空字符串返回 0，浮点数返回浮点数值。其他格式字符串一律返回 NaN（包含数字也如此）。

#### 5. 随机排列数组种的元素

利用数组方法 sort 进行随机数排列

```js
var arr = [1, 2, 3, 4, 5, 6, 7, 8];
console.log(
	arr.sort(function() {
		return Math.random() - 0.5;
	})
); // [4, 6, 3, 2, 8, 7, 5, 1] 数组内容随机
```

#### 6. 展开多维数组

只需使用 Spread（拓展）运算符

```js
var temp = [1, [2, 1], [5, 7]];
var _arr = [].concat(...temp);
console.log(_arr); // [1, 2, 1, 5, 7]
```

#### 7. 短路条件

当我们的 if 判断语句比较多时，代码看起来有点冗余，哪有啥方法可以优美一点操作呢？

```js
if (true) {
	console.log(1);
}

// 丢掉麻烦的if语句
true && console.log(1);
```

#### 8. 动态属性名称

我一直以为必须先声明一个对象，然后才能分配一个动态属性，其实还可以通过变量操作。

```js
var dynamic = 'age';
var person = { name: 'Jake', [dynamic]: '22' };
console.log(person); // {name: 'Jake', age: 22 };
```

#### 9. 使用 length 调整大小 / 清空数组

如果要调整数组的大小或者清空数组，只需要操作数组的 length 属性即可

```js
var array = [1, 2, 3, 4, 5, 6];
array.length = 4;
console.log(array);
array.length = 0;
console.log(array);
```

这只是一些简单的 hacker 技巧，希望对您有帮助，后续我还会发掘和新增更多的 hacker :smirk:

### 参考内容

- Fatima Nawaz [9 个极其强大的 JavaScript 技巧](https://www.infoq.cn/article/KSVZ7eetcKuL9GVqO7eF)
