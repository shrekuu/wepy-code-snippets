const path = require('path')
const prod = process.env.NODE_ENV === 'production'
const cosBaseUrl = require('./wecos.config').baseUrl

// 生成一个随机字符串, 给图片资源请求当 hash
function getRandomStr() {
  var result = ''
  while (!result) result = Math.random().toString(36).substr(2, 10)
  return result
}

// 处理指向 cos 的图片地址
const replacePlugin = [
  {
    // 将样式里指向 /cos/images 的背景图片地址指 cos 并加上随机字符串
    // 目前直接指向对象存储, 未指向 CDN
    // 修改这里正则时注意前后行断言
    filter: /\.wxss/,
    config: {
      find: /(?<=background(-image)?:.*url\()[^)]+(?=\))/g,
      replace: function (match) {
        // 去掉引号
        if (/^('|")[^'"]+('|")$/.test(match)) {
          match = match.slice(1, -1)
        }

        // 本地图片
        if (/^\.\.\//.test(match)) {
          return match + '#' + getRandomStr()
        }

        // cos 图片
        if (/^\/cos\/images\//.test(match)) {
          return cosBaseUrl + match.substr(11) + '#' + getRandomStr()
        }

        return match + '#' + getRandomStr()
      }
    }
  },
  {
    // 将模版里指向 /cos/images 的地址指向 cos 并加上随机字符串
    // 将类似 ../images 本地图片一地址加上随机字符串
    filter: /\.wxml/,
    config: {
      find: /(?<=src=")[^"]+(?=")/g,
      replace: function (match) {
        // 本地图片
        if (/^\.\.\//.test(match)) {
          return match + '#' + getRandomStr()
        }

        // cos 图片
        if (/^\/cos\/images\//.test(match)) {
          return cosBaseUrl + match.substr(11) + '#' + getRandomStr()
        }

        // 剩下的就是一些从 api 数据中取来的动态地址了, 不处理
        return match
      }
    }
  }, {
    // 如果你也要用 moment.js 处理日期，要在小程序里要替换一点点东西
    filter: /moment\.js$/,
    config: {
      find: /([\w[]a-d.]+)\s*instanceof Function/g,
      replace: function (matches, word) {
        return ' typeof ' + word + " ==='function' "
      }
    }
  }
]

module.exports = {
  wpyExt: '.wpy',
  eslint: true,
  cliLogs: !prod,
  build: {
    web: {
      htmlTemplate: path.join('src', 'index.template.html'),
      htmlOutput: path.join('web', 'index.html'),
      jsOutput: path.join('web', 'index.js')
    }
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    },
    aliasFields: ['wepy', 'weapp'],
    modules: ['node_modules']
  },
  compilers: {
    // less: {
    //   compress: prod
    // },
    sass: {
      // outputStyle: 'compressed'
    },
    babel: {
      sourceMap: true,
      presets: [
        'env'
      ],
      plugins: [
        // 注意，这里用的四个可能要手动安装一下，参考 package.json 安装
        // wepy 默认没带或没带够
        // 项目中用 wepy-redux 就要用到 decorator 等
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread',
        'transform-export-extensions'
      ]
    }
  },
  plugins: {
    // replacePlugin 提上去了
    replace: replacePlugin
  },
  appConfig: {
    noPromiseAPI: ['createSelectorQuery']
  }
}

if (prod) {
  // 压缩sass
  module.exports.compilers.sass = {outputStyle: 'compressed'}

  // 生产环境不要 console.log 类的东西了，能省一点空间是一点
  module.exports.compilers.babel.plugins.push(['transform-remove-console', {'exclude': ['error', 'warn']}])

  // 压缩js
  module.exports.plugins = {
    replace: replacePlugin,
    uglifyjs: {
      filter: /^((?!rxwx).)*\.js$/,
      config: {}
    }
    // 图片除了 tabbar 那里非要放在本地其它图片一律放到对象存储里去，手动压缩好再上传
    // imagemin: {
    //   filter: /\.(jpg|png|jpeg)$/,
    //   config: {
    //     jpg: {
    //       quality: 80
    //     },
    //     png: {
    //       quality: 80
    //     }
    //   }
    // }
  }
}
