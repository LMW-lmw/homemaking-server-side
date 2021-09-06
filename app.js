const express = require('express')
const app = express()
const path = require('path')
//配置插件
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const expressJWT = require('express-jwt')
//路由
const users = require('./routes/users')
const books = require('./routes/book')
const level = require('./routes/level')
const place = require('./routes/place')
const rack = require('./routes/rack')
const tier = require('./routes/tier')
const test = require('./routes/test')
//自己封装的方法
const database = require('./util/db_databsae')
// const getToken = require('./routes/token')
//向外公布的静态资源目录
app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use(
  '/node_modules/',
  express.static(path.join(__dirname, './node_modules/'))
)

//配置post请求
app.use(bodyParser.urlencoded({ extends: false }))
app.use(bodyParser.json())

//配置跨域
app.use(cors())

// app.use() 里面放的 expressJWT().unless()
// 注册 token 验证中间件
app.use(
  expressJWT({
    // 解析口令, 需要和加密的时候一致
    secret: 'Lmw',
    // 加密方式: SHA256 加密方式在 express-jwt 里面叫做 HS256
    algorithms: ['HS256'],
  }).unless({
    // 不需要验证 token 的路径标识符
    path: [
      '/login',
      '/register',
      '/sendEmile',
      '/adminLogin',
      '/testGet1',
      '/testGet2',
      '/testGet3',
    ],
  })
)

app.use(users)
app.use(books)
app.use(place)
app.use(level)
app.use(rack)
app.use(tier)
app.use(test)

app.use((err, req, res, next) => {
  res.status(502).json({
    err_code: 502,
    message: err.message,
  })
})

app.listen(3000, function () {
  console.log('服务器启动，端口号3000')
})
