---
layout: post
title: Git 学习笔记
subtitle: Git 学习过程中的笔记和理解
date: '2015-12-22 13:29:01 +0800'
catalog: study
keyword: Git学习，Github，版本管理
excerpt: Git的学习笔记，从Git的基本用法到各个命令的实践和理解。这里主要参照廖雪峰老师和阮一峰老师的博客，当然也通过google查阅大量资料以及实践的结果。
tags: [git, 工具]
categories: articles study notes
header_img: /assets/imgs/posts/git-study/github.jpg
---

## Git 安装后的设置

对Git使用用户的全局设置。

```bash
$ git config --global user.name "oujiaqi"
$ git config --global user.email "471884121@qq.com"
```

当然也可以对单个仓库进行特定设置。

## 创建版本库

初始化一个Git仓库，使用`git init`命令。

添加文件到Git仓库，分两步：

* 第一步，使用命令`git add <file>`，注意，可反复使用添加多个文件，添加所有用`*`或者`.`。
* 第二步，使用命令`git commit`提交，完成。同时这里可以添加参数`-m “XXX”`添加本次添加说明。

举个例子：

```bash
$ git add file1.txt
$ git add file2.txt file3.txt
$ git add .
$ git commit -m "add 3 files."
```

## 时光穿梭机

* 使用`git status`命令查看工作区状态。
* 使用`git diff`查看修改内容。

### 版本回退

`HEAD`指向的版本是当前版本，Git允许我们在版本之间穿梭，使用命令`git reset --hard commit_id` 或者 `git reset --hard HEAD^`，`HEAD^`表示上个版本，`HEAD^^`表示上上个版本，上100个版本可以写`HEAD~100`。

穿梭前，用`git log`可以查看提交历史，以确定回退到哪个版本，而参数`--pretty=oneline`表示一行显示。

要重返未来，要用`git reflog`查看命令历史，获得`commit_id`以便回退。

***注意***：这里的`commit_id`不需要写全，只需要写几位能识别就好了。

### 工作区和缓存区

#### 工作区

我们当前可以看到的目录。

#### 版本库

工作区中的隐藏目录`.git`，就是Git的版本库。其中包括了stage（或index）的缓存区，自动创建的第一个分支`master`，以及指向`master`的一个指针`HEAD`。

第一步`git add`把文件添加进去，实际上是把修改的文件添加到缓存区；

第二步`git commit`提交更改，实际上是吧缓存区的所有内容提交到当前分支；

提交成功后，若未对工作区做任何修改，则工作区是干净的。

### 管理修改

Git 跟踪并管理的是修改，而不是文件。

修改后的文件，需要先添加到缓存区，再提交，才算提交到master里。

`git diff HEAD -- filename` 比较当前工作区和版本库里最新版本区别。

### 撤销修改

这里有两种情况，一种是文件自修改后还没放到缓存区，撤销修改后回到和版本库一模一样的状态，一种是文件修改后已经添加到了缓存区后，又做了修改，则撤销修改就是回到添加到缓存区后的状态。总之就是让文件回到最近一次的`git commit`or`git add`时的状态。

场景1：当你改乱了工作区某文件，想直接丢弃工作区修改，用命令`git checkout -- filename`，撤销修改后和版本库一模一样了。

场景2：当你不但改乱了工作区的某个文件的内容，还添加到了缓存区时，想丢弃修改，分两步，第一步用命令`git reset HEAD file`，就回到场景1，第二步按场景1操作。

场景3：已经提交了不合适的修改到版本库里，想撤销本次提交，参考**回退版本**，前提是没有推送到远程库。

### 删除文件

`git rm filename`用于删除一个文件，之后再用`git commit`提交，此用法和`git add`类似。

## 远程仓库
***注意，我们这里使用的是SSH协议，其实git也是支持https协议的，只是https协议需要每次都认证，而且https会慢一点。***

第一步，创建SSH Key。主目录下查看`.ssh`文件，若无，则创建。

```bash
$ ssh-keygen -t rsa -C "471884121@qq.com"
```

一路确定，就会在主目录创建一个`.ssh`文件夹，里面有`id_rsa`和`id_rsa.pub`。

第二步， 登陆github，添加id_rsa.pub文件内容到SSH key上。

第三步，将上述的私钥加到ssh agent中去，用以下命令：

```bash
$ ssh-add ~/.ssh/id_rsa
```

### 添加远程仓库

先有本地库，后有远程库，关联远程库。

1. 在github上创建空白仓库
2. 使用命令`git remote add origin git@github.com:oujiaqi/hello-world.git`关联一个远程库，其中`origin`是远程库的名字，可以自己定义。必须要在一个本地仓库中执行
3. 关联后使用命令`git push -u origin master`第一次推送master分支的所有内容；
4. 此后，每次本地提交，都可以使用`git push origin master`推送最新修改。

### 从远程库克隆

先有远程库，后有远程库。

`git clone`克隆一个远程库。`git clone git@github.com:oujiaqi/hello-world.git`

克隆到本地的仓库已经自动关联了远程库，可以直接使用`git push origin master`推送修改。

## 分支管理

主分支`master`分支，`HEAD`严格来说不是指向提交，而是指向`master`，`master`才是指向提交的，所以，`HEAD`指向的就是当前分支。每次提交，`commit`后，`master`分支都会向前移动一步。

![](/assets/imgs/posts/git-study/git1.png)

当我们创建新的分支，例如`dev`时，Gi创建了一个指针叫`dev`，指向`master`相同的提交，再把`HEAD`指向`dev`，就表示当前分支在dev上。

![](/assets/imgs/posts/git-study/git2.png)

实际上创建一个分支只是增加了一个`dev`指针，改了`HEAD`的指向，工作区的文件没有任何变化！不过从现在开始，对工作区的修改和提交就是针对`dev`分支了，比如新提交一次后，`dev`指针往前移动一步，而`master`指针不变。

![](/assets/imgs/posts/git-study/git3.png)

假如`dev`分支工作完成了，就可以把`dev`合并到`master`上，就是直接把`master`指向`dev`的当前提交，就完成了合并。

![](/assets/imgs/posts/git-study/git4.png)

Git合并分支很快，改改指针，工作区内容也不变。

合并分支后，也可以删除`dev`分支，就是把`dev`指针删除，就只剩下一条`master·`分支了。

![](/assets/imgs/posts/git-study/git5.png)

### 创建与合并分支

查看分支：`git branch` 其中有`*`的为当前分支。

创建分支：`git branch <name>`。

切换分支：`git checkout <name>`。

创建+切换分支：`git checkout -b <name>` 其中`-b`参数作用。

合并指定分支到当前分支：`git merge <name>`，通俗讲就是把**别人改变了的**东西合并过来自己这里。可以是`Fast-forward`“快进模式”，也可以是其他模式。“快进模式”时，就是把指向当前分支的指针指向指定分支。上面的例子就是如此。例如，dev分支已经做了修改并提交成功，我现在在master分支运行`git merge dev`，默认就是master指针指向了dev，即master指针和dev指针一样了。

删除分支：`git bransh -d <name>` ，注意合并完成后再删除。

### 解决冲突

在两个分支都对同一文件做了修改后，分支合并就会产生冲突。这时我们就要解决冲突。

场景假设：

1. 创建`feature`分支，切换到该分支，在该分支上编辑"readme.txt"文件，并添加提交。
2. 切换到`master`分支，同样编辑"readme.txt"文件，添加提交，成为这样了：
    
    ![](/assets/imgs/posts/git-study/git6.png)

3. 试图合并，不成功，产生冲突，git不知道你要的是那一份。
4. `git status` 可以告诉我们冲突的文件，然后我们直接查看冲突文件的内容，并编辑。`<<<<<<<<`，`=========`，`>>>>>>>>>`标记处不同分支的内容，我们修改后保存，再使用命令`git add`，`git commit`添加提交，就变成了这样了：
    
    ![](/assets/imgs/posts/git-study/git7.png)

5. `git log`可以查看分支合并情况。`git log --graph`可以看到分支合并图，`git log --graph --pretty=oneline --abbrev-commit`命令可以显示简单点。
6. 删除`feature`分支，完成。

### 分支管理策略

Git 通常使用`Fast forward`模式合并分支。这种模式下，删除分支就会丢掉分支信息，如果强制禁用该模式，那么Git就会merge时生成一个新的commit，这样从分支历史上就可以看出分支信息，这里主要就是用到`--no-ff`方式的`git merge`，下面实战一下。

1. 创建并切换分支`dev`，修改文件并提交
2. 切换到`master`分支，合并分支。`git merge --no-ff -m "merge with no-ff`，这里加了`-m`参数，因为需要提交
3. `git log`查看分支历史

此模式下，合并后像这样了：

![](/assets/imgs/posts/git-study/git8.png)

***分支策略***

1. `master`分支非常稳定，仅仅用来发布新版本，平时不在上面干活。
2. 干活都在`dev`上，干完活后合并到`master`上，在`master`上发布新版本。
3. 你和你的小伙伴都在`dev`分支上干活，每个人都有自己的分支，时不时的往`dev`分支上合并就好了。

团队合作就像这样了：

![](/assets/imgs/posts/git-study/git9.png)

### Bug分支

场景应用：软件开发中，忽然出现bug需要及时修复，bug可以通过新的临时分支修复，修复后合并分支就好，然后将临时分支删除。但是，当前正在`dev`上进行的工作还没有完成，还不想提交，那工作区的内容怎么办？Git提供了一个`stash`功能，可以把当前工作现场”储存“起来，等以后恢复现场后继续工作。

`git stash`存储现场。

`git satsh list`查看保存的工作现场。

`git stash apply stash@{0}`恢复，但不删除。

`git stash drop stash@{0}`删除。

`git stash pop`恢复同时删除。

***注意*** 只能在原来的分支恢复。

### Feature分支

开发一个新的feature，最好新建一个分支。

如果要丢弃一个没有合并过的分支，可以通过`git branch -D <name>`强行删除。

### 多人协作

当从远程仓库克隆时，实际上Git自动把本地`master`分支和远程`master`分支对应起来了。并且，远程仓库默认名为`origin`。

查看远程库信息用`git remote`。

用`git remote -v`查看更详细信息。若无推送权限，则看不到push地址。

本地新建的分支如果不推送到远程，对其他人就是不可见的，推送到远程库，都是分支对分支的。

从本地推送分支，使用`git push origin <branch-name>`，如果推送失败，则可能是你的提交和新的提交有冲突，先用`git pull`抓取远程的新提交，然后本地合并解决冲突，合并冲突方式同上，再推送就ok了。

如果`git pull`提示"no tracking information"，则说明本地分支和远程分支的链接关系没有创建，用命令`git branch --set-upstream-to origin/branch-name branch-name`关联，则`git pull`后，会抓取远程的对应分支，到你指定的分支。

抓取分支，在本地创建和远程对应的分支，使用`git branch -b branch-name origin/branch-name`，***本地和远程分支的名称最好一样***，抓取后，在本地修改文件，直接推送就可以推送到对应的远程分支。

## 标签管理

标签相当于版本库的快照，其实就是指向某个commit的不能动的指针。

### 创建标签

用命令`git tag <name>`用于新建一个标签，默认为`HEAD`，也可以指定一个commit id。例如: `git tag <name> <commit id>`。

`git tag -a <tagname> -m "balabala..."`可以指定标签信息。也可以用`git tag -a <tagname> -m "balalala..." <commit id>`指定的commit id添加。

`git tag -s <tagname> -m "blala..."`可以用PGP签名标签，即用私钥签名一个标签。PGP签名标签是不可伪造的。

`git tag`查看所有标签。

`git show <tagname>`查看标签信息。

### 操作标签

创建的标签只存储在本地，不会自动推送到远程。

`git push origin <tagname>`可以推送一个本地标签。

`git push origin --tags`推送全部未推送过的本地标签。

`git tag -d <tagname>`可以删除一个本地标签。

`git push origin :refs/tags/<tagname>`可以删除一个远程标签。

## 使用GitHub

在GitHub上，可以任意Fork开源项目，Fork后就是克隆一个项目仓库到自己的账号下的仓库，然后从自己的账号下clone到本地。

如下关系：

![](/assets/imgs/posts/git-study//git10.png)

自己拥有Fork后的仓库的读写权限。

可以推送pull requst给官方仓库来共享代码。

## 自定义Git

让Git现实颜色，让命令更醒目 `git config --global color.ui true`。

### 忽略特殊文件

忽略某些文件时，即不需要提交，直接忽略，可以编写`.gitignore`文件，该文件可以自己定义，同时github也为我们准备了一些[配置文件](https;//github.com/github/gitignore)。

`.gitignore`文件本身要放到版本库里，并可以对它进行版本管理。

### 配置别名

`--global`是全局配置，不加则默认当前仓库配置，每个仓库的配置文件在`.git/config`文件里，当前用户的git配置文件在户主目录下的隐藏文件`.gitconfig`下。

配置命令别名`git config --global alias.st status`，用`st`表示`status`。

### 搭建Git服务器

待更新~

## 查看、删除、重命名远程分支和tag

`git branch -a`查看全部分支。

`git branch -v`查看远程分支。

`git push origin --delete <branchName>`删除远程分支。

`git push origin --delete tag <tagname>`删除远程tag。

`git push origin <local_branch>:<remote_branch>`推送本地分支到远程分支。

`git push origin :<branchName>`推送一个空分支到远程分支，相当于删除该分支。

`git push origin :refs/tags/<tagname>`推送一个空tag到远程tag相当于删除一个tag。

`git fetch -p`在fetch之后删除掉没有与远程分支对应的本地分支。

重命名远程分支，先删除远程分支，再重命名本地分支，`git branch -m <originalName> <newname>`，然后推送到远程库中。

`git fetch origin tag <tagname>`获取远程tag。

## 几个不错的Git学习清单

- [Git远程操作详解](http://www.ruanyifeng.com/blog/2014/06/git_remote.html)

- [Git工作流程](http://www.ruanyifeng.com/blog/2015/12/git-workflow.html)

- [常见Git命令清单](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)

- [Git分支管理策略](http://www.ruanyifeng.com/blog/2012/07/git.html)

- [Git教程](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)