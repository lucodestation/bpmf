# 玻坡摸佛

## 目录结构

- components
  - 公共部分
- plugins
  - 插件，放进去（来自网络）的文件一般不会动里边的代码
- images
  - 图片资源（图片、图标）
- utils
  - 多个页面需要使用的 js 逻辑
- js
  - 各页面逻辑
- userCont
  - 个人中心里面的页面
- css
  - 各页面样式

## 插件

- animate.css -  CSS 动画库
  - [http://www.animate.net.cn/](http://www.animate.net.cn/)
- swiper - 轮播图插件，支持触摸滑动
  - 版本 4 支持缩放，支持 IE11
  - [https://www.swiper.com.cn/api/index.html](https://www.swiper.com.cn/api/index.html)
- jQuery - 不需要多说了吧
  - [https://www.jquery123.com/](https://www.jquery123.com/)
  - [https://jquery.cuishifeng.cn/](https://jquery.cuishifeng.cn/)
- syalert - jQuery 弹框插件
  - 没有官网
  - 打开弹窗 syalert.syopen(id)
  - 关闭弹窗 syalert.syhide(id)
  - 其中id为弹窗自定义的ID
  - 关于动画请直接在html上定义
  - 进入动画定义：sy-enter="zoomIn"
  - 离开动画 sy-leave="zoomOut"
  - 其中 zoomIn和zoomOut是 animate.css里面的动画名称。可以将动画名称更改为animate.css里面的动画名称。

## TS 自动转 JS

1. 全局安装 TS

```bash
$ npm install -g typescript
```

2. 创建 `tsconfig.json`

```bash
$ tsc --init
```

创建后将 `"target": "es2016",` 改为 `"target": "es5",`

3. 监视 TS

VSCode 终端 -> 运行任务 -> typescript -> tsc:监视 - tsconfig.json

> TS 转成 ES5 语法的 JS 只是转换了 箭头函数、解构等语法，但还不支持 promise、includes 等，需再引入 babel-polyfill.js

## 命名规范

### HTML

- class
  - 短横线
- id
  - 小驼峰

### js

- 事件名
  - handleXxxXxx

## 其他

当前标签页打开页面
window.location.href = 'url'
新标签页打开页面
window.open('url')
返回上一页
window.history.go(-1)

打开弹框
syalert.syopen('id')
关闭弹框
syalert.syhide('id')