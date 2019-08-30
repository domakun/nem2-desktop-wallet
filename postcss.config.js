const isWin32 = require('./src/config/packge.js').isWin32
const propList = isWin32 ? ["*", '!font-size'] : ["*"]

module.exports = {
  plugins: {
    "postcss-import": {},
    "autoprefixer": {},
    "postcss-pxtorem": {
      "rootValue": 100,
      "propList": propList,
      "selectorBlackList": ["mint-"],
    }
  }
}
