const jwt = require('jsonwebtoken')
let jwtScrect = 'lmw'
//登录接口 生成token的方法
let setToken = function (id) {
  return new Promise((resolve, reject) => {
    //expiresln 设置token过期的时间
    const token = jwt.sign({ id: id }, jwtScrect, { expiresIn: '24h' })
    resolve(token)
  })
}
//各个接口需要验证token的方法
let getToken = function (token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      console.log('token是空的')
      reject({
        error: 'token 是空的',
      })
    } else {
      var info = jwt.verify(token.split(' ')[1], jwtScrect)
      resolve(info) //解析返回的值（sign 传入的值）
    }
  })
}

module.exports = {
  setToken,
  getToken,
}
