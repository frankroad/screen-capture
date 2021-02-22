## screen-capture
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![chrome web store](https://img.shields.io/chrome-web-store/v/cdddgmgngjghgafknpngbifganipdinf.svg)](https://chrome.google.com/webstore/detail/cdddgmgngjghgafknpngbifganipdinf) [![extension downloads](https://img.shields.io/chrome-web-store/users/cdddgmgngjghgafknpngbifganipdinf.svg?label=users)](https://chrome.google.com/webstore/detail/cdddgmgngjghgafknpngbifganipdinf)

> 独立开发的第二款浏览器插件

谷歌商店：[下载地址](https://chrome.google.com/webstore/detail/cdddgmgngjghgafknpngbifganipdinf)

不能翻墙地址：[下载地址](https://chrome.pictureknow.com/extension?id=1849f82696be460791d32c41525d3f01)

----
## 功能设计

- [x] 部分截图
- [x] 当前页面截图
- [x] 全屏截图


## 技术要点

### webpack

开发之基石，基本配置都一样，由于插件开发及打包的特殊性，配置了同步版本及合并各模块中国际化文件的脚本。

### react

使用 Chrome 浏览器提供的接口截图，通过 Canvas 拼接图片并截取特定图片。

### content-script & popup & background 通信

三处脚本的数据交换可谓是插件开发的关键点，也是最容易混乱的地方，后续要整合下事件流
