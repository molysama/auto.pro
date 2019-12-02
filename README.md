# 简介
针对auto.pro的npm扩展包，主要包括
- 对pro的函数进行封装和安卓版本兼容
- 添加找图找色的分辨率适配和缓存机制
- 提供一套合理的脚本流程机制

包名 | 版本 |  描述  
-|-|-
@auto.pro/cli | ![](https://img.shields.io/npm/v/@auto.pro/cli.svg) | 工具包 |
@auto.pro/core | ![](https://img.shields.io/npm/v/@auto.pro/core.svg) | 扩展包核心 |
@auto.pro/action | ![](https://img.shields.io/npm/v/@auto.pro/action.svg) | 操作插件，提供点击、滑动等功能 |
@auto.pro/search | ![](https://img.shields.io/npm/v/@auto.pro/search.svg) | 图色插件 |
@auto.pro/stream | ![](https://img.shields.io/npm/v/@auto.pro/stream.svg) | 流程插件 |

## 安装工具
cli预置了一些项目模板，含有webpack、babel、ts等工具，能帮助您快速创建复杂功能的应用。请确保你已经安装了node.js。
```
npm i -g "@auto.pro/cli"
```
cli安装完毕后，将有一个可用的系统命令```auto-cli```，执行```auto-cli -h```可查看简单说明。

## 创建项目

执行以下命令，即可根据选项在**当前目录**下创建一个```project-name```项目
```
auto-cli create project-name
```
### UI模式(键盘↑↓进行切换，回车确认)
- 无  
预置了webpack的基础项目模板  
- html  
预置了webpack、html(webview)的项目模板  
- android  
预置了webpack、auto UI示例，[查看说明](https://github.com/molysama/auto-template-android)。

## 初始化
使用vscode打开刚才创建的项目，执行以下命令使用淘宝源进行安装
```
npm i --registry=https://registry.npm.taobao.org
```

安装完毕后，```src```目录就是我们写逻辑代码的地方了，```src```内的文件可直接无缝使用```main.js```里的变量，且可直接加载npm包。  
由于webpack无法直接使用xml格式，因此无法在src内直接写UI。折衷的办法有两种：
- 将UI部分写在```main.js```里。
- ```src```内通过```files.read```读取外部xml文件。

## 运行
```src```内是源码，不适合直接发布成项目，应将其编译成```dist/app.js```文件，并让```main.js```引入(模板已经默认引用了这个文件)。  
以下两个命令可以进行编译：
- ```npm run build``` 进行一次编译
- ```npm start``` 实时监听```src```目录内的文件并更新最终编译产物。

## 缺憾
auto.pro截至目前(v8.0.2)，在运行和保存项目时会扫描所有文件（哪怕已经通过ignore忽略了），```node_modules```又含有大量文件，因此项目的运行和保存会比较耗时。

有任何疑问、意见或建议，欢迎直接联系本人QQ或提issue。(*^_^*)

# LICENSE
MIT
