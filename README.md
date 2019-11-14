# auto.pro
针对auto.pro的npm扩展包，主要包括
- 对pro的函数进行封装和安卓版本兼容
- 添加找图找色的分辨率适配和缓存机制
- 提供一套合理的脚本流程机制

包名 | 版本 |  描述  
-|-|-
@auto.pro/cli | ![](https://img.shields.io/npm/v/@auto.pro/cli.svg) | 工具包 |
@auto.pro/core | ![](https://img.shields.io/npm/v/@auto.pro/core.svg) | 核心(必须) |
@auto.pro/action | ![](https://img.shields.io/npm/v/@auto.pro/action.svg) | 操作插件，提供点击、滑动等功能 |
@auto.pro/search | ![](https://img.shields.io/npm/v/@auto.pro/search.svg) | 图色插件 |
@auto.pro/stream | ![](https://img.shields.io/npm/v/@auto.pro/stream.svg) | 流程插件 |

## 安装工具
cli预置了一些项目模板，预置了webpack、babel、ts等工具，能帮助您快速创建复杂功能的应用。请确保你已经安装了node.js。
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
实施中，尚不可用 

## 初始化
使用vscode打开刚才创建的项目，执行以下命令使用淘宝源进行安装
```
npm i --registry=https://registry.npm.taobao.org
```

安装完毕后，```src```目录就是我们写逻辑代码的地方了(UI代码依旧写在```main.js```里)，```src```内的文件可直接无缝使用```main.js```里的变量，且可加载npm包。

## 运行
```src```内是源码，不适合直接发布成项目，在命令行执行```npm run build```后，会将```src```内的所有代码打包编译成```dist/app.js```文件，这个文件才是```main.js```真正发布和加载的。

# LICENSE
MIT
