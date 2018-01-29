---
layout: post
title: Mac下启动定时任务
subtitle: Mac下启动定时任务
date: '2018-01-29 20:54:24 +0800'
catalog: study
keyword: Mac 定时任务 crontab launchctl 自动化
excerpt: 近来需要在Mac下定时跑任务，于是查询了相关资料，这里总结一下如何在Mac创建定时任务，也将一些遇到的坑和解决办法归纳起来，希望对大家有帮助。
tags: [Mac, bash]
categories: articles study notes
header_img: 
---

Mac创建定时任务主要由两种方式：crontab命令和launchctl定时任务。

## crontab命令

### 命令格式
> usage: crontab [-u user] file
>        crontab [-u user] { -e | -l | -r }

相关参数：

- crontab file: 用指定的文件替代目前的 crontab 任务
- -u: 只有 root 可执行该命令，用于操作指定用户的任务列表
- -e: 编辑 crontab 的工作内容
- -l: 查看 crontab 的工作内容
- -r: 移除所有的 crontab 的工作内容

### 任务格式

每项任务至少有六个参数，如下例子所示：

```
crontab -e
30 11 * * * /usr/bin/python /Users/ouou/Desktop/test.py
```

前面五个参数的含义代表的意义如下表所示：

| 代表意义 | 分钟 | 时钟 | 日期 | 月份 | 周 |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 数字范围 | 0-59 | 0-23 | 1-31 | 1-12 | 0-7（0和7都是周日）|

第五项参数之后的参数则是具体的任务命令，这里建议任务参数都尽量使用**绝对路径**指明，要不然容易导致路径不正确等问题。

其他的定时任务格式

每隔3分钟执行一次（间隔时间，关键符号`/`）
```
*/3 * * * * /usr/bin/python /Users/ouou/Desktop/test.py 
```

5点30分、6点30分、7点30分执行一次（关键符号`-`）
```
30 5-7 * * * /usr/bin/python /Users/ouou/Desktop/test.py 
```

5点30分、7点30分、12点30分执行一次（关键符号`,`）

```
30 5,7,12 * * * /usr/bin/python /Users/ouou/Desktop/test.py 
```

### 具体建立定时任务

1. 直接在终端输入命令：
  ```
  crontab -e
  ```
  
  就会进入任务编辑模式，新建一行，按照上述格式，添加你想创建的任务，保存就行了，定时任务就创建好了。
  
2. 新建一个文件，如下例子，新建了一个名叫task.txt的文件，里面包含了定时任务设置，如下：

   ```
   30 5,7,12 * * * /usr/bin/python /Users/ouou/Desktop/test1.py 
   30 5-7 * * * /usr/bin/python /Users/ouou/Desktop/test2.py
   ```

  然后在终端输入命令

   ```
   crontab task.txt
   ```
   就会将所有任务添加到cron里面。
   
### 常见问题

1. 直接使用`crontab -e`编辑时，无法正常添加定时任务，这是因为还没有相关文件，可以先自己新建一个文件，然后使用`crontab file`命令添加，之后就可以直接使用`crontab -e`编辑定时任务了
2. Mac下，任务创建好了，但是有时遇到并没有按照预期执行任务，这是为什么呢？原来crontab启动的条件之一是需要存在 `/etc/crontab` 文件，如果不存在，定时任务不会正常进行，详情可以参考这个 [在MAC OS X上如何启用crontab？](http://blog.csdn.net/sanbingyutuoniao123/article/details/70599086) 文章，这里我们可以自己新建一个 `/etc/crontab` 文件解决，如下命令：

   ```
   sudo touch /etc/crontab
   ```

### crontab服务的开关

ubuntu下的任务配置和mac下的任务配置基本一致，最后补充一下mac和ubuntu下crontab服务的启动和开关。

- mac下

   ```
   sudo /usr/sbin/cron start
   sudo /usr/sbin/cron restart
   sudo /usr/sbin/cron stop
   ```

- ubuntu下

   ```
   sudo /etc/init.d/cron start
   sudo /etc/init.d/cton stop
   sudo /etc/init.d/cron restart
   ```
   
## launchctl命令

通过launchctl命令创建定时任务我觉得其实比crontab更麻烦些，需要自定义创建plist文件，参数稍有设置不对，定时任务可能就不会正常创建，一开始在mac下使用crontab一直不成功，所以也尝试了一下使用launchctl创建定时任务，这里也做一下总结。

### 创建plist文件

launchctl根据plist文件信息启动任务，plist存放的目录如下

> /Library/LaunchDaemons  系统启动就执行
/Library/LaunchAgents  当前用户登录才执行
~/Library/LaunchAgents 由用户自己定义的任务项
/System/Library/LaunchAgents 由Mac OS X为用户定义的任务项
/System/Library/LaunchDaemons 由Mac OS X定义的守护进程任务项

以下是一个plist模板，在 `~/Library/LaunchAgents` 创建一个名叫 `com.demo.plist` 的plist文件，如下所示，实际创建任务时，可根据以下模板做相应的更改。

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <!-- Label唯一的标识 -->
  <key>Label</key>
  <string>com.demo.plist</string>
  <!-- 指定要运行的脚本 -->
  <key>ProgramArguments</key>
  <array>
    <string>/Users/demo/run.sh</string>
    <!-- 其他参数如下添加 -->
    <string>test</string>
  </array>
  <!-- 指定要运行的时间，也可以使用StartInterval指定间隔多长时间执行一次，单位为秒 -->
  <key>StartCalendarInterval</key>
  <dict>
        <key>Minute</key>
        <integer>00</integer>
        <key>Hour</key>
        <integer>22</integer>
        <key>Day</key>
        <integer>22</integer>
        <key>Weekday</key>
        <integer>4</integer>
        <key>Month</key>
        <integer>3</integer>
  </dict>
<!-- 标准输出文件 -->
<key>StandardOutPath</key>
<string>/Users/demo/run.log</string>
<!-- 标准错误输出文件，错误日志 -->
<key>StandardErrorPath</key>
<string>/Users/demo/run.err</string>
</dict>
</plist>
```

### 加载任务

创建好plist文件后，需要加载才能生效，另外修改了任务也需要unload在重新load，具体命令如下所示：

```bash
# 加载任务, -w选项会将plist文件中无效的key覆盖掉，建议加上
$ launchctl load -w com.demo.plist

# 删除任务
$ launchctl unload -w com.demo.plist

# 查看任务列表, 使用 grep '任务部分名字' 过滤
$ launchctl list | grep 'com.demo'

# 开始任务，马上执行任务，必须先load
$ launchctl start  com.demo.plist

# 结束任务
$ launchctl stop   com.demo.plist
```