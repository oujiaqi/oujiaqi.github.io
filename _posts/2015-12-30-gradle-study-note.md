---
layout: post
title: Gradle 学习笔记
subtitle: Gradle 官网教程学习笔记
date: '2015-12-30 20:32:01 +0800'
catalog: study
keyword: Gradle，自动构建工具，Java编程
excerpt: Gradle 作为一个自动构建工具，在java编程非常实用，安卓开发也会用到。分布式作业用java实现远程调用恰好要用到Gradle，于是便上官网看了一番它的教程，这是简单的学习笔记。
tags: [Gradle, 工具]
categories: articles study notes
header_img: 
---

## Gradle 简介

Gradle是以Groovy语言为基础，面向Java应用为主的，基于DSL（领域特定语言）语法的自动化构建工具。不是用xml语言，相对易读。

## 安装

1. 需要JDK环境。
2. 下载，从官网[Gradle](http://www.gradle.org/downloads "gradle")下载，如果只是安装，建议下载二进制文件即可，省空间。
3. 将下载到的*zip*格式文件解压到你要装的位置。在我的Mac，我解压到`/usr/local/`目录下，你也可以解压到其他地方，看自己。
4. 配置环境变量，解压得到的文件为`gradle-2.10`（因为我下的是2.10的版本），里面有`bin`目录。所以我的路径名为`/usr/local/gradle-2.10/bin`，要将这个路径加到环境变量的`PATH`中去。Mac下打开`~/.bash_profile`文件，将路径添加到PATH中，然后利用`source ~/.bash_profile`使其生效。Linux也是类似的做法。
5. 检测，打开终端，输入`gradle -v`显示gradle版本就表示成功了，否则环境变量未设置好，请再次设置。

## 简单命令行操作

终端运行 `gradle task_name` 命令就可以执行相应的任务，后面也可以加多个任务名，都会运行。同时，gradle也会运行其依赖，但是注意，每个单独的任务只会运行一次。

例如以下依赖图：

![](/assets/imgs/posts/gradle-study/commandLineTutorialTasks.png)

build.gradle

```gradle
task compile << {
    println 'compiling source'
}

task compileTest(dependsOn: compile) << {
    println 'compiling unit tests'
}

task test(dependsOn: [compile, compileTest]) << {
    println 'running unit tests'
}

task dist(dependsOn: [compile, test]) << {
    println 'building the distribution'
}
```

`gradle test` 就会执行`compile`，`compile Test`，`test`。

`gradle dist -x test` 就不会执行`compile Test`和`test`，但是会执行`compile`和`dist`。

默认情况下，build过程中，只要有task出现错误就会终止接下来的任务，加上`--continue`会执行每个需要执行的task。

略缩名，例如可以使用`gradle d`表示`dist`，用`gradle cT`表示`compileTest`。

`gradle -q -b subdir/myproject.gradle hello` 使用-b参数指定执行的gradle文件，-q参数表“Log error only”，是`--quit`缩写。

`gradle -q -p subdir hello` 使用-p参数表示项目目录执行。

`gradle -q projects` to list projects。

`gradle -q tasks` to list tasks。

`gradle -q tasks --all` obtain more information about tasks。

`gradle -q help --task someTask` show task usage details。

`gradle -q dependencies` list project dependencies 当前目录的。

`gradle -q projectname:dependencies` 项目的依赖。

`gradle -q dependencies --configuration testCompile` 过滤器，只看testCompile的依赖。

`gradle -q properties` list project properties。

`--profile` will record some useful timing information while your build is running and write a report to the build/reports/profile directory。

## Gradle Wrapper（包装）

利用Gradle Wrapper可以直接安装Gradle并配置好，并且可以指定相应的版本。

### Executing a build with the Wrapper

- ./gradlew <task> (on Unix-like platforms such as Linux and Mac OS X)  bash 文件
- gradlew <task> (on Windows using the gradlew.bat batch file)

Wrapper由以下文件组成，文件结构也如下：

- gradlew (Unix Shell script)
- gradlew.bat (Windows batch file)
- gradle/wrapper/gradle-wrapper.jar (Wrapper JAR)
- gradle/wrapper/gradle-wrapper.properties (Wrapper propertise)

You will find the Gradle distributions in your user home directory under $USER_HOME/.gradle/wrapper/dists.

### Adding the Wrapper to a project

- 直接在项目下输入命令`gradle wrapper gradle --gradle-version 2.7`，其中`--gradle-version`指定Gradle版本。

- build.gradle文件中指定：

```gradle
task wrapper(type: Wrapper) {
    gradleVersion = '2.10'
}
```

- 产生的文件目录如下：

```
- sample/
  -- gradlew
  -- gradlew.bat
  -- gradle/wrapper/
    --- gradle-wrapper.jar
    --- gradle-wrapper.properties
```

直接改变`gradle-wrapper.properies`文件中的version即可。

### Verification of downloaded Gradle distributions

Generating a SHA-256 hash：

```
> shasum -a 256 gradle-2.4-all.zip
371cb9fbebbe9880d147f59bab36d61eee122854ef8c9ee1ecf12
b82368bcf10  gradle-2.4-all.zip
```

Configuring SHA-256 checksum verification
gradle-wrapper.properties：

```
distributionSha256Sum=371cb9fbebbe9880d147f59bab36d61e
ee122854ef8c9ee1ecf12b82368bcf10
```

### configuration

配置文件`gradle-wrapper.properties`file。

## The Gradle Daemon（后台驻留程序）

Gradle runs on the Java Virtual Machien(JVM) and uses several supporing libraries that require a non-trivial initialization time. Gradle Daemon: a long-lived background process that executes your builds much more quickly.

### Enable the Daemon

在配置文件`/.gradle/gradle.properties`修改如下代码配置，若无此文件，则添加。

```
org.gradle.daemon=true
```

配置文件大概可以在这些地方找：

- C:\Users\<username> (Windows Vista & 7+)
- /Users/<username> (Mac OS X)
- /home/<username> (Linux)

### stop an exiting Daemon

Every Daemon stops after 3 hours on inactivity. 

using `gradle --stop` to stop right away.

using `jps` to see any running Daemons listed with the name GradleDaemon.

### Another way to enable Daemon

Using `--daemon` and `--no-daemon` to configure every time. It`s temporary.

### Other points

memory may up to 1GB of heap without specifying a maximun heap size.

## Dependency Management Basics

### An example of declaring dependencies

build.gradle

```
apply plugin: 'java'

repositories {
    mavenCentral()
}

dependencies {
    compile group: 'org.hibernate', name: 'hibernate-core', version: '3.6.7.Final'
    testCompile group: 'junit', name: 'junit', version: '4.+'
}
```

### dependency configurations

- **compile** The dependencies required to compile the production source of the project
- **runtime** The dependencies required by production classes. By default, also includes the compile time dependendies.
- **testCompile** The dependencies required to compile the test source of the project. By default, also includes the compiled production classes and the compile time dependencies.
- **testRuntime** The dependencies required to run the tests. By default, also includes the compile, runtime, and test compile dependencies.

### External dependencies

A external dependency is identified using group, name and version attributes.

build.gradle

```
dependencies {
    compile group: 'org.hibernate', name: 'hibernate-core', version: '3.6.7.Final'
}
```

also can be shortcut like "group:name:version"

```
dependencies {
    compile 'org.hibernate:hibernate-core:3.6.7.Final'
}
```

### Repositories

Usage of Maven central repository

build.gradle

```
repositories {
    mavenCentral()
}
```

Usage of remote Maven repository

```
repositories {
    maven {
        url "http://repo.mycompany.com/maven2"
    }
}
```

Usage of a remote Ivy directory

```
repositories {
    ivy {
        url "http://repo.mycompany.com/repo"
    }
}
```

Usage of a local Ivy directory

```
repositories {
    ivy {
        // URL can refer to a local directory
        url "../local-repo"
    }
}
```

### Publishing artifacts

Publishing to an Ivy repository

```
uploadArchives {
    repositories {
        ivy {
            credentials {
                username "username"
                password "pw"
            }
            url "http://repo.mycompany.com"
        }
    }
}
```

You can run `gradle uploadArchives` to run this.

Publishing to a Maven repository

```
apply plugin: 'maven'

uploadArchives {
    repositories {
        mavenDeployer {
            repository(url: "file://localhost/tmp/myRepo/")
        }
    }
}
```

## Introduction to multi-project builds

### It's up to chapter 8.


