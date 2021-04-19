const express = require('express')
const users = express.Router()
const md5 = require('blueimp-md5')
const database = require('../util/db_databsae');
const getToken = require('./token')
const jwt = require("jsonwebtoken")
const sendEmail = require('../util/emil')
let code= ""
 /**
 * 发送邮件
 * @param {string} to 收件方邮箱
 * @param {Function} callback 回调函数（内置参数）
 *
 */
users.post('/sendEmile' ,function (req, res) {
  let body = req.body
  let to = body.email
  let title = '图书馆管理'
  while(code.length<5){
    code+=Math.floor(Math.random()*10);
  }
  console.log(code);
  sendEmail(req,res,to,code,title,callback)
  function callback(err,data){
    if(err){
      res.status(500).json({
        err_code: 500,
        message: err.message
      })
    }else{
      res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
    }
  }
})
/**
 * 注册接口
 * @param name
 * @param code
 * @param passowrd
 * @param email
 * @param nickname
 * err_code返回状态码
 * 0:注册成功
 * 1:用户已存在
 * 2:验证码错误
 * 500:报错
 * */
users.post('/register', function (req, res) {
  let body = req.body
  let selectSql = `select name from user where name = '${body.name}' or nickname = '${body.nickname}'`
  let num
  if(body.code!=code){
    res.status(200).json({
      err_code: 2,
      message: '验证码错误'
    })
  }else {
    code = ''
    function decide(result) {//判断注册的用户名是否在数据库中
      num = result.length
      if (num == 0) {
        let pass = md5(md5(body.passowrd) + 'lcl')
        let sql = `INSERT INTO user (name,password,email,nickname) VALUES ('${body.name}','${pass}','${body.email}','${body.nickname}') `
        function insert(result) {
          res.status(200).json({
            err_code: 0,
            message: 'ok'
          })
        }
        database(sql, insert, errCallback)
      } else {
        res.status(200).json({
          err_code: 1,
          message: '用户名已存在'
        })
      }
    }

    function errCallback(err) {
      res.status(500).json({
        err_code: 500,
        message: err.message
      })
    }

    database(selectSql, decide, errCallback)
  }
})
/**
 * 登录接口
 * @param name
 * @param password
 * err_code返回状态码
 * 0:登录成功
 * 1:用户名密码错误
 * 500:报错
 *
 * */
users.post('/login', function (req, res) {
  let body = req.body
  // let pass = md5(md5(body.passowrd) + 'lcl')
  let sql = `select id,name,password,identity from user where name = '${body.name}' and password = '${body.password}'`
  function success(data) {
    if (data.length === 0) {
      res.status(200).json({
        err_code: 1,
        message: '用户名或者密码错误'
      })
    }
    if (data.length === 1) {
      let user = `'${data[0].id}'`
      let token = 'Bearer ' + jwt.sign({
        user: user
      }, "Lmw", {
        expiresIn: 60 * 60 //过期时间，按照秒算
      })
      res.status(200).json({
        err_code: 0,
        message: 'ok',
        token: token,
        identity: data[0].identity,
        userID: data[0].id
      })
    }
  }

  function err(err) {
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }

  database(sql, success, err)
})

/**
 * 管理员登录
 * @param name
 * @param password
 *
 * */
users.post('/adminLogin', function (req, res) {
  let body = req.body
  // let pass = md5(md5(body.passowrd) + 'lcl')
  // let name = req.query.name
  // let password = req.query.password
  let name = body.name
  let password = body.password
  let sql = `select id,name,password,identity,nickname from user where name = '${name}' and password = '${password}'`
  function success(data) {
    if (data.length === 0) {
      res.status(200).json({
        err_code: 1,
        message: '用户名或者密码错误'
      })
    }
    if (data.length === 1 && (data[0].identity == 1 || data[0].identity == 2)) {
      let user = `'${data[0].id}'`
      let token = 'Bearer ' + jwt.sign({
        user: user
      }, "Lmw", {
        expiresIn: 60 * 60 //过期时间，按照秒算
      })
      res.status(200).json({
        err_code: 0,
        message: 'ok',
        token: token,
        identity: data[0].identity,
        userID: data[0].id,
        nickname: data[0].nickname
      })
    }
  }

  function err(err) {
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }

  database(sql, success, err)
})

/**
 * 获取用户数量
 * 0:成功
 * 500:服务器错误
 * */
users.get('/getUserNum', function (req,res) {
  let sql = 'SELECT count(*) num from user where identity = 3 or identity=4'
  database(sql,success,error)
  function success(data) {
    res.status(200).json({
      err_code: 0,
      message: data
    })
  }
  function error(err){
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }
})
/*
/验证token

 */
// users.get('/getAll', function (req, res) {
//   // let token = req.query.token || req.body.token || req.headers.token;
//   // let flag = getToken(req,res)
//   // if(flag==false){ //一旦报错了，说明用户信息校验失败
//   //   res.status(200).json({
//   //     err_code: 1,
//   //     message: 'token失效'
//   //   })
//   // }else{ //校验成功
//   //   console.log('token存在');
//   let sql = `select * from user`
//   database(sql, success, error)
//
//   function success(data) {
//     res.status(200).json({
//       err_code: 0,
//       message: data
//     })
//   }
//
//   function error(err) {
//     res.status(500).json({
//       err_code: 1,
//       message: err.message
//     })
//   }
//
//   // }
// })


module.exports = users