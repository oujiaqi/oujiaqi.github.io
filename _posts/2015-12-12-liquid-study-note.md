---
layout: post
title: Liquid 学习笔记
subtitle: 简单强大的模板语言
date: '2015-12-12 22:19:01 +0800'
catalog: study
keyword: 模板语言，Liquid，Jekyll，博客
excerpt: Liquid是一门模板语言，使用Jekyll搭建博客就利用了Liquid模板语言。Liquid语法简单易学，这是个人在使用Jekyll搭建博客的过程学习Liquid的笔记。
tags: [Liquid, Jekyll]
categories: articles study notes
header_img: 
---

[Liquid](https://docs.shopify.com/themes/liquid)是一门用Ruby编写的开源的模板语言

## Basics

### Handles

Handles用于获取Liquid对象的属性。默认情况下，handle是对象的标题经过大写字母转换为小写，`-`替代特殊符号或者空格后得到的。例如：

{% raw %}

```html
<!-- the content of the About Us page -->
{{ pages.about-us.content }}
```

{% endraw %}

#### Handles 创建方式

- 大写转小写，同名自动添序号。"Shirt"变“shirt"，多个变“shirt-1”，“shirt-2”等；
- 空格或特殊字符变`-`。

#### 获取属性方法

{% raw %}

```html
{{ pages.about-us.title }}
{{ pages["about-us"].title }}

{% for product in collections[settings.home_featured_collection].products %}
    {{ product.title }}
{% endfor %}
```

{% endraw %}

### Operators

#### Basic operators

`==`，`!=`，`>`，`<`，`>=`，`<=`，`or`，`and`。

#### The contains Operator

{% raw %}

```html
{% if product.title contains "pack" %}
  This product's title contains the word Pack.
{% endif %}
```

{% endraw %}

### Data types

1. String: `assign my_string = "Hello World!"`
2. Number
3. Boolean: true and false
4. Nil: 相当于None，空，也为false
5. Array: 用for语句获取或者`[ ]`获取
6. EmptyDrop: An EmptyDrop object is returned if you try to access a deleted object (such as a page or post) by its handle. EmptyDrop objects only have one attribute, `empty?`, which is always true. 可以用来检测对象是否存在

### Truthy and falsy

除了`nil`和`false`，其他都是true，空的字符串也是true。空的字符串可以用 `blank`检测，例如：`stringA == blank`。EmptyDrop也为true。

## Tags

### Control flow tags

`if`，`else`，`elsif`

{% raw %}

```html
 <!-- If customer.name = 'anonymous' -->
  {% if customer.name == 'kevin' %}
    Hey Kevin!
  {% elsif customer.name == 'anonymous' %}
    Hey Anonymous!
  {% else %}
    Hi Stranger!
  {% endif %}
```

{% endraw %}

`case`，`when`

{% raw %}

```html
{% assign handle = 'cake' %}
{% case handle %}
  {% when 'cake' %}
     This is a cake
  {% when 'cookie' %}
     This is a cookie
  {% else %}
     This is not a cake nor a cookie
{% endcase %}
```

{% endraw %}

`unless` 除非，除开

{% raw %}

```html
{% unless product.title == 'Awesome Shoes' %}
    These shoes are not awesome.
{% endunless %}
```

{% endraw %}

### Iteration tags

`for` 遍历

{% raw %}

```html
{% for product in collection.products %}
    {{ product.title }}
{% endfor %}
```

{% endraw %}

`break` 结束

{% raw %}

```html
{% for i in (1..5) %}
    {% if i == 4 %}
      {% break %}
    {% else %}
      {{ i }}
    {% endif %}
{% endfor %}
```

{% endraw %}

`continue` 继续

{% raw %}

```html
{% for i in (1..5) %}
    {% if i == 4 %}
      {% continue %}
    {% else %}
      {{ i }}
    {% endif %}
{% endfor %}
```

{% endraw %}

`limit` for的限制

{% raw %}

```html
<!-- if array = [1,2,3,4,5,6] -->
  {% for item in array limit:2 %}
    {{ item }}
  {% endfor %}
<!-- output 1 2 -->
```

{% endraw %}

`offset` for的偏移

{% raw %}

```html
<!-- if array = [1,2,3,4,5,6] -->
  {% for item in array offset:2 %}
    {{ item }}
  {% endfor %}
<!-- output 3 4 5 6 -->
```

{% endraw %}

`range` 数字或变量都可以

{% raw %}

```html
{% assign num = 4 %}
{% for i in (1..num) %}
  {{ i }}
{% endfor %}

{% for i in (3..5) %}
  {{ i }}
{% endfor %}
```

{% endraw %}

`reversed` 倒序

{% raw %}

```html
<!-- if array = [1,2,3,4,5,6] -->
{% for item in array reversed %}
    {{ item }}
{% endfor %}
```

{% endraw %}

`cycle` 循环取值，必须在for循环中

{% raw %}

```html
{% cycle 'one', 'two', 'three' %}
{% cycle 'one', 'two', 'three' %}
{% cycle 'one', 'two', 'three' %}
{% cycle 'one', 'two', 'three' %}

<!-- output one two three one -->
```

{% endraw %}

`cycle group` 防止上下cycle混用，以分开。

{% raw %}

```html
<ul>
{% for product in collections.collection-1.products %}
  <li{% cycle 'group1': ' style="clear:both;"', '', '', ' class="last"' %}>
    <a href="{{ product.url | within: collection }}">
      <img src="{{ product.featured_image.src | product_img_url: "medium" }}" alt="{{ product.featured_image.alt }}" />
    </a>
  </li>
{% endfor %}
</ul>
<ul>
{% for product in collections.collection-2.products %}
  <li{% cycle 'group2': ' style="clear:both;"', '', '', ' class="last"' %}>
    <a href="{{ product.url | within: collection }}">
      <img src="{{ product.featured_image.src | product_img_url: "medium" }}" alt="{{ product.featured_image.alt }}" />
    </a>
  </li>
{% endfor %}
</ul>
```

{% endraw %}

```tablerow```  制作表格`table`，必须在table标签内

{% raw %}

```html
<table>
{% tablerow product in collection.products %}
  {{ product.title }}
{% endtablerow %}
</table>

<!-- 一行多列 -->
```

{% endraw %}

`cols` 定义列数，`limit` 限制个数，`offset` 间隔取数，`range` 范围取数，使用同 for 循环

{% raw %}

```html
{% tablerow product in collection.products cols:2 offset:3 %}
  {{ product.title }}
{% endtablerow %}
```

{% endraw %}

### Theme tags

#### comment

解释作用，不读取

{% raw %}

```html
My name is {% comment %}super{% endcomment %} Shopify.
<!-- comment 之内的为注释，不读取 -->
```

{% endraw %}

#### include

用于插入某片段，使用`with`赋值

例如有一片段 color.liquid

{% raw %}

```html
color: '{{ color }}' shape: '{{ shape }}'
```

{% endraw %}

另一片段 theme.liquid

{% raw %}

```html
{% assign shape = 'circle' %}
{% include 'color' %}
{% include 'color' with 'red' %}
{% include 'color' with 'blue' %}
{% assign shape = 'square' %}
{% include 'color' with 'red' %}
```

{% endraw %}

output

```html
color: shape: 'circle'
color: 'red' shape: 'circle'
color: 'blue' shape: 'circle'
color: 'red' shape: 'square'
```

#### form

#### layout

{% raw %}

```html
<!-- loads the templates/alternate.liquid template -->
{% layout 'alternate' %}
```
{% endraw %}

{% raw %}

```html
<!-- load nothing -->
{% layout none %}
```

{% endraw %}

#### paginate

标页码

{% raw %}

```html
{% paginate collection.products by 5 %}
  {% for product in collection.products %}
    <!--show product details here -->
  {% endfor %}
{% endpaginate %}
```

{% endraw %}

#### raw 

原生

{% raw %}

```html
{% RAW %}{{ 5 | plus: 6 }}{% ENDRAW %} is equal to 11.

<!-- output {{ 5 | plus: 6 }} is equal to 11. -->
```

{% endraw %}

**注意：上面的`RAW`和`ENDRAW`在实际应用中应该为小写，即上述标签正确为`raw`和`endraw`。这里我是为了避免解析错误而特意使用大写，raw标签内不能内嵌raw标签，由于在上述代码外我已经使用了一个raw标签包含，那么里面再内嵌一个raw标签就会报错！**


### Variable tags

#### assign

定义新变量

{% raw %}

```html
{% assign foo = "bar" %}
{{ foo }}
```

{% endraw %}

#### capture

捕获并赋值给变量

{% raw %}

```html
{% capture my_variable %}I am being captured.{% endcapture %}
{{ my_variable }}
```

{% endraw %}

#### increment

自增长，默认初始从0，不受assign影响

{% raw %}

```html
{% increment variable %}
{% increment variable %}
{% increment variable %}

<!-- output 0 1 2 -->
```

{% endraw %}

{% raw %}

```html
{% assign var = 10 %}
{% increment var %}
{% increment var %}
{% increment var %}
{{ var }}

<!-- output 0 1 2 10 -->
<!-- 变量和自增长相互独立 -->
```

{% endraw %}

#### decrement

与increment相同，初始为-1，递减

## Object

未完待续。。