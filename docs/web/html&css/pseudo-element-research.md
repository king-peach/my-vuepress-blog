# 伪元素究极补救方案

![image.png](./images/pseudeo-element-research/pseudeo-element-research-header-img.png)<br />
<br />**定义**：为元素增添有趣样式的一个属性，通常伪元素选择器用 '::'双冒号表示（ie8只支持单冒号，兼容性写法单冒号）<br />​

伪元素有六个，分别为：::after、::before、::first-line、::first-letter、::section、::backdrop<br />js获取伪元素的方式：通过window对象的getComputedStyle方法去获取伪元素。firefox3.6的子框架方法不同<br />示例：<br />

```javascript
const div = document.querySelector('div')
window.getComputedStyle(div, ':before') // 常规写法
document.defaultView.getComputedStyle(div, ':before') // firefox3.6上访问子框架的伪元素
```

<br />获取伪元素样式：获取到伪元素以后通过键值对的方式或者getPropertyValue方法去获取具体属性值<br />**示例**：<br />

```javascript
const div = document.querySelector('div')
window.getComputedStyle(div, ':before').width
window.getComputedStyle(div, ':before').getPropertyValue('width')
```

<br />**设置伪元素属性值**:<br />一、通过css设置 ，::after{ content: '', ......}、具体内容查看mdn关于伪元素的介绍<br />二、通过js设置，通过cssStyleSheet的insertRule来为伪元素修改样式(需要注意浏览器兼容性，这是一个试验阶段API)<br />示例：<br />

```javascript
document.styleSheets[0].addRule('div::after', 'color: red')
```

<br />伪元素的关键属性content，此属性为元素增加内容修饰，内容可添加字符串、多媒体、数字、计数器等……<br />修改content的方法：<br />一、通过设置元素的特定属性为content赋值，示例：<br />

```javascript
<style>
  .red::after { content: attr(data-attr);}
</style>
<body>
  <div class="red" data-attr="content内容"></div>
	<script>
    document.querySelector('.red').setAttribute('data-attr', '修改后内容')
	</script>
</body>
```

<br />二、通过cssStyleSheet的insertRule去设置，方法见以上内容<br />三、通过url()设置多媒体文件<br />四、使用counter()方法调用计时器，不是很实用，示例：<br />

```javascript
div::before { content: counter(chapter); counter-increment: chapter;}
```

<br />**注意事项**：伪元素的content属性很强大，可以写入各种字符串和部分多媒体文件。但是伪元素的内容只存在于CSS 渲染树中，并不存在于真实的DOM中。所以为了SEO优化，最好不要在伪元素中包含与文档相关的内容
