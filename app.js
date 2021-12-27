const express = require('express')
const app = express()
const path = require('path')
//配置插件
const bodyParser = require('body-parser')
const cors = require('cors')
//路由
const users = require('./routes/users')
const department = require('./routes/department')
const role = require('./routes/role')
const menu = require('./routes/menu')
const category = require('./routes/category')
const workers = require('./routes/workers')
const echarts = require('./routes/echart')
// 配置token
const vertoken = require('./util/token')
const expressJwt = require('express-jwt')

// const getToken = require('./routes/token')

//配置post请求
app.use(bodyParser.urlencoded({ extends: false }))
app.use(bodyParser.json())

//配置跨域
app.use(cors())

// token
// 解析token获取用户信息
app.use(function (req, res, next) {
  var token = req.headers['authorization']
  if (token == undefined) {
    return next()
  } else {
    vertoken
      .getToken(token)
      .then((data) => {
        req.data = data
        return next()
      })
      .catch((error) => {
        return next()
      })
  }
})
//验证token是否过期并规定那些路由不需要验证
app.use(
  expressJwt({
    secret: 'lmw',
    algorithms: ['HS256'],
  }).unless({
    path: ['/login'], //不需要验证的接口名称
  })
)
//token失效返回信息
app.use(function (err, req, res, next) {
  if (err.status == 401) {
    return res.status(401).send('token失效')
    //可以设置返回json 形式  res.json({message:'token失效'})
  }
})

//向外公布的静态资源目录
app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use(
  '/node_modules/',
  express.static(path.join(__dirname, './node_modules/'))
)
// 注册路由
app.use(users)
app.use(department)
app.use(role)
app.use(menu)
app.use(category)
app.use(workers)
app.use(echarts)
app.use((err, req, res, next) => {
  res.status(502).json({
    err_code: 502,
    message: err.message,
  })
})

app.listen(3000, function () {
  console.log('服务器启动，端口号3000')
})
