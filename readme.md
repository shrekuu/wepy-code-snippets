# WePY 小程序开发代码片段收集

使用 WePY 开发小程序过程中收集一些感觉会复用的代码片段。

代码里都有注释与使用示例，拿来即用。

### 关于在小程序里使用腾讯对象存储里的图片

https://github.com/tencentyun/wecos

使用腾讯自家的这个小工具，全局安装 `wecos` 这个工具。把图片上传到对象存储一个 `bucket` 里，配置复制一份 `wecos.config.json.example` 为 `wecos.config.json` 然后根据自己的对象存储信息改好配置，`wecos.config.json` 文件不加入仓库。在根目录的 `cos` 目录里再创建一个目录叫 `upload`（这个目录不加入仓库），然后每次要上传图片了放在 `cos/upload` 里就好，然后执行 `wecos` 命令，图片就传好了，传好的图片会被备份到 `cos/images` 目录，这样你在写的时候直接这样写 `/cos/images/logo.png` 就好，你会发现编辑器还能自动提示，多好。图片上传好后 `cos/upload` 里的目录结构会完整地复制到 `cos/images` 目录里，所以你可以根据你页面地图片的使用情况更好地为图片分好目录。

而在 `wepy.config.js` 文件的 `replacePlugin` 里已经处理好 `/cos/images/logo.png` 这样的路经，每次编译后的路径类似 `https://dta-1234567890.cos.ap-beijing.myqcloud.com/mina/logo.png#t9y5uu1vzz`，从而避免缓存问题。


### 字体图标

小程序里无法添加字体文件，只能转成 base64 编码然后直接写入样式里。 

使用 https://transfonter.org/ 这个网站提供的服务帮助将字体图标转换 base64 编码风格后写入样式。

推荐转成 woff 格式的编码就好。

示例：

```
@font-face {
  font-family: "iconfont";
  src: url('data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAA4YAA0AAAAxxxxxxx') format('woff');
}

```