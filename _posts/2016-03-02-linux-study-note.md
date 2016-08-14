---
layout: post
title: Linux 学习笔记
subtitle: 鸟叔私房菜学习实践笔记
date: '2016-03-02 21:22:34 +0800'
catalog: study
keyword: Linux
excerpt: 阅读鸟叔 Linux 私房菜过程中的学习笔记。
tags: [Linux, 终端]
categories: articles study Linux
header_img: 
---

## 一、基本命令

`[Ctrl]+[Alt]+[F1]~[F6]`  -- 文字界面登录  tty1 - tty6终端

`[Ctrl]+[Alt]+[F7]`  -- 图形界面

`exit`  -- 注销登录

`date` -- 显示日期时间

`date +%Y/%m/%d` -- 格式化输出

`cal [[month] year]` -- 显示日历

`bc` -- 计算机     `quit` -- 退出计算机

`[Tab]`  -- 自动补全命令或文件名   单按和双按

`[Ctrl]+c`  -- 关闭当前执行程序

`[Ctrl]+d`  -- 代表键盘输入结束  (End Of File  EOF  End Of Input)

### 在线求助 man page 和 info page

`[Tab]`  --  双击 可查看所有可用命令

`man [command]`  -- 查看对应命令说明解释  空格翻页  `q` 退出  `/string` 向下查找
`?string` 向上查找   `n`  `N`  分别上下个查找内容

`info`   -- 类似 man 命令 用 ？ 查看命令

`nano`  -- 简单编辑器

### 正确关机

`who`  -- 查看谁在线

`netstat -a`   -- 查看网络联机状态

`ps -aux`  -- 查看后台执行程序 

`sync`  -- 数据同步写入磁盘

`shutdown`  -- 惯用关机 参数 `-h` 马上关机 + 时间

`reboot` `halt` 硬关机  `poweroff`  重启 关机

### 忘记 root 密码

将系统重启，读秒的时候按下任意键，按下 e 进入grub编辑模式，将光标移到 kernel 一行，在最后方输入 single，按下 [Enter] 再按 b 就可以进入单用户维护模式。在此模式下的tty1 不需要输入密码即可获得终端控制权，修改密码吧。`pwsswd`

## 二、文件权限和目录配置

文件所有者，用户组，用户，其他人

`ls -al`  -- 显示文件权限和属性

-rw-rwxrwx  第一个字母表文件类型，其后分别问文件所有者，同组用户，其他用户的读写执行权限

其中第一个字母表示：`d`表目录，`-`表文件，`l`表连接文件，`b`表设备文件有可供存储的接口设备 ，`c`表设备文件里的串行端口设备，诸如鼠标等

ls 显示后面为 文件大小，时间（月，日）

`ls -l --full-time` 显示完整时间格式

### 文件属性与权限改变

`chgrp`  改变文件所属用户组  “-R” 递归  例子 `chgrp student file.txt`

`chown`  改变文件所有者
- 例如 `chown ouou:student file.txt` ouou用户  student组

`chmod`  改变用户权限
- 数值改变 例如 `chmod -R 777 file.txt`
- 符号改变 例如`chmod u=rwx,go=rx file.txt`  `u`用户，`g`组，`o`其他，`a`所有，`+`添加，`-`除去，`=`设置
- `x` 文件是否可执行，或者文件夹是否可以进入，相当于执行

### Linux 目录配置

例子

|  | 可分享 | 不可分享 |
|---| ---|---|
| 不可变(static) | /usr(软件放置处) | /etc(配置文件) |
| 不可变(static) | /opt(第三方软件) | boot(开机与内核文件) |
| 可变动(variable) | /var/mail(用户邮件信箱) | /var/run(程序相关) |

`/var`程序主要数据存放

几个重要文件
`/etc`配置文件，`/bin`重要执行文件，`/dev`所需要的设备文件，`/lib`库，`/sbin`重要的系统文件，不能与根目录`/`放在不同分区

## 三、文件与目录管理

### 目录与路径

绝对路径和相对路径

`.` 当层目录，`..`上一层目录，`-`前一工作目录，`~`目前用户主文件夹，`~account`代表account用户主文件夹，`cd`进入，`pwd`显示当前目录，`mkdir`新建目录，`rmdir`删除一个空目录

### 文件和目录管理

`ls`查看命令，参数：`-a`全部文件包括隐藏，`-d`只显示文件夹， `-l`详细信息，`h`文件容量以易读方式输出

`cp`复制，参数：`-i`存在覆盖前询问，`-r`递归复制，`-u`目标与源文件有不同才复制。也可以通过目标名和源名不同来改名字。

`rm`删除，参数：`-rfi`，分别递归，强制，询问

`mv`移动，参数：`-fiu`，分别前置，询问，更新才移动

### 文件内容查阅

#### 直接查看
`cat`直接查看，参数`-n -T -v -A`分别打印行号，将[Tab]按键以^I打印，列出一些看不出来的特殊字符，列出一些特殊字符

`tac`和`cat`一样，不过是从最后一行打印到第一行，反过来的

`nl`和`cat`类似

#### 可翻页查看

`more`，还可以查询一页页翻动，功能众多

`less` 也是一页一页翻动

#### 数据选取

`head -n 23 file.txt` ，表选前23行 默认10行

`tail -n 23 file.txt` n为数字，表选后23行

`tail -n +100 file.txt` 列出100行之后的

`tail -f file.txt` 持续监测文件内容，输入[ctrl]+c 才停止，可以用来监控文件写入过程。

#### 非纯文本文件

`od [-t TYPE] file` TYPE可选：`a`默认字符输出，`c`ASCII，`d[size]`十进制输出，每个整数占 size bytes，`f[size]`浮点数，`o[size]`八进制数，`x[size]`十六进制

#### 修改文件时间或创建新文件

modification time( mtime ) 文件内容改动时间

status time( ctime ) 状态改动，权限属性等 ls命令默认显示时间

access time( atime ) 访问时间 

`touch [-a -c -d -m -t] file` 时间改为当前时间，参数分别：访问时间，修改时间，修改日期（也可以`--date=”date`修改），修改mtime，后面接要修改的时间而不是当前时间。touch+文件 命令也常用于创建空文件。

### 文件与目录默认权限与隐藏权限

#### 文件默认权限

`umask` 显示除去属性的数值 或者 `umask -S`  显示当前用户新建文件或目录时权限默认值。  

#### 文件隐藏属性

`chattr [+-=][ASacdistu]` 文件属性设置 其中 `a`文件只能增加数据，`i`文件不能修改，只有root才能修改，提高安全

`lsattr [-adR] file or path` 查看属性，参数分别：隐藏文件属性也显示，若为目录仅显示目录本身属性，连同子目录一并列出来。

#### 文件特殊权限：SUID，SGID，SBIT

- SUID：s标志在文件所有者的x权限上，仅对二进制可执行程序，可以让可执行者在执行过程中暂时获得所有者的权限。数字4
- SGID：s标志在文件组的x权限上，可对二进制可执行程序，可让执行者暂时成为改组成员获得相应权限。数字2
- Sticky Bit(SBIT) ：只针对目录有效，用户对该目录具有读写，但是只有用户本身和root才能删除该用户在此文件夹创建的文件或文件夹。 数字1，例如`/tmp`

添加
- 数字，例如`chmod 4755 test`，`chmod 6755 test`
- 符号，例如`chmod u=rwxs,go+x test`

#### file

`file file`查看文件类型

### 命令文件查询

`which [-a] command` 查看执行文件路径，参数`-a`显示所有

`whereis [-bmsu] file` 查找，参数：只二进制文件，只manual路径下说明文件，只source源文件，除上三的其他文件。查找数据库文件，有时更新慢和结果有出入

`locate [-ir] keyword` 定位，参数：忽略大小写差异，正则表达式的显示方式。查找数据库文件，同上

`find [PATH] [option] [action]`

- 时间参数有`-atime``-ctime``-mtime`，例如`-mtime n`n天之前一天之内修改的，`-mtime -n`n天之去n当天修改过的，`-mtime +n`n天之前的除n当天。
- 用户用户组：`-uid n` 用户id，`-gid n`组id，`-user name`用户名，`-group namegroup`用户组，`-nouser`不存在所有者，`-nogroup`不存在用户组
- 文件属性：`-name filename`文件名，`-size [+-]SIZE`大小(大于小于，c表byte，k表1024bytes)，`-type TYPE`，`-perm mode`刚好等于mode(777)权限，`-perm -
-mode`必须包括全部mode的，`-perm +mode`包含任意mode
- `-exec command` 执行其他命令，例如`find / -perm +700 -exec ls -l {} \;` `-exec` 到 `\;` 关键字，`{}`找到的内容防止地方
- `find / -name "*http*"` 注意`*`作用

## 四、Linux磁盘与文件系统管理

### 简介和简单操作

`df -hiTa [文件或目录]` 列出文件系统整体磁盘使用量，参数：格式输出，以inode为数量显示，该分区文件系统名称，列出所有文件系统

`du -ahs [文件或目录]` 评估文件系统磁盘使用量（常用用于评估目录所占容量），参数：所有，格式化，列总量而已

`ln [-sf] 源 目标` 连接文件（目标-->源，相当于快捷键），参数：symbolic_link，若目标存在先删除再创建，不加参数则为hard_link，hard方式不支持文件夹，少用。 

### 磁盘分区、格式化、检验与挂载

`fdisk [-l] 设备名称` 磁盘分区工具，里面有具体操作说明，参数：输出设备所有分区内容

`mkfs [-t 文件系统格式] 设备名称` 格式化，格式有：ext3，ext2，vfat(linux和windowsU盘共享常用)等




   




