---
layout: post
title: 简单的 bash 语法
subtitle: 个人 bash 学习笔记
date: '2016-02-05 21:52:01 +0800'
catalog: study
keyword: bash，终端，脚本，Linux，shell
excerpt: bash 是最常见的shell，Linux、Mac都默认采用bash作为shell。掌握一定的bash对于Linux和Mac的操作和学习有着重要意义。这是我个人在学习过程中总结的简单bash语法。
tags: [bash, Linux, 终端]
categories: articles study notes
header_img: 
---

- **`#!/bin/bash` 脚本标准起始行**

- **`echo "Hello world"` 输出**

- **if 语句基本结构**

```bash
if [ <条件> ]; then   # 注意，前一个'['左右都有空格，后一个做空右分号
    执行语句
else 
    执行另一些语句
fi   #  if 结束标志
```

- **判断语句**

    `-eq` 验证是否相等

    `-ne` 验证是否不等

    `-gt` 验证是否大于

    `-lt` 验证是否小于

    `-ge` 验证是否大于等于

    `-le` 验证是否小于等于

    例子如下：

```bash
#!/bin/bash
number=15
if [ $(($number % 3)) -eq 0 ]; then  # '$' 表示引用
    echo "Fizz"
fi
if [ $(($number % 5)) -eq 0 ]; then
    echo "Buzz"
fi
if [ $(($number % 3)) -eq 0 ]; then
    if [ $(($number % 5)) -eq 0 ]; then
        echo "FizzBuzz"
    else
        echo "None"
    fi
fi
```

- **逻辑控制之循环**

    基本结构如下

```bash
while [ TEST ]; do
    执行语句
done
```

- **注释用 `#`**

- **`case` 语句选择执行**

```bash
case "$1" in
    start)
        执行语句
;;  # 两个`;;`表示结束case语句
    stop)
        执行语句
;;
    *)
        执行语句
;;  # 针对上述case之外的情况
esac  # case的结束标志
```

- **一个简单的 init脚本**

```bash
#!/bin/bash
### BEGIN INIT INFO
# Provides:                touchfile
# Required-Start:      $all
# Required-Stop:      $all
# Default-Start:         2 3 4 5
# Default-Stop:         0 1 6
# Short-Description: Run TouchFile
# Description:           Run TouchFile
### END INIT INFO
TOUCHFILE="/home/ou/Desktop/touch.file"
case "$1" in
    start)
        echo "Creating $TOUCHFILE"
        touch $TOUCHFILE
;;
    stop)
        echo "Removing $TOUCHFILE"
        rm $TOUCHFILE
;;
    restart)
        echo "Recreating $TOUCHFILE"
        rm $TOUCHFILE
        touch $TOUCHFILE
;;
    reload)
        echo "Re-Touching $TOUCHFILE"
        touch $TOUCHFILE
;;
    *)
        echo " Usage: touchfile.sh <start|stop|restart|reload>"
;;
esac  # case的结束标志
exit 0

```


