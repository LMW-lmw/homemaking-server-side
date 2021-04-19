const express = require('express')
const level = express.Router()
const database  = require('../util/db_databsae');


/**
 * 修改楼层信息
 * @param levelId
 * @param content
 * @param userStatus
 * err_code说明
 * 0 成功
 * 30 权限不足
 * 500 错误
 * */
level.post('/updateLevel', function (req, res) {
  let body = req.body
  function success(data){
    res.status(200).json({
      err_code: 0,
      message: 'ok'
    })
  }
  function error(err){
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }
  if(body.userStatus == 1 || body.userStatus == 2){
    let sql = `UPDATE booklevel set floor = '${body.content}' where id = '${body.levelId}'`
    database(sql,success,error)
  }else{
    res.status(200).json({
      err_code: 30,
      message: '请不要冒充管理员'
    })
  }
})
/**
 * 添加楼层
 * @param content
 * @param userStatus
 * err_code说明
 * 0 成功
 * 30 权限不足
 * 500 错误
 * */
level.post('/addLevel', function (req, res) {
  let body = req.body
  function success(data){
    res.status(200).json({
      err_code: 0,
      message: 'ok'
    })
  }
  function error(err){
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }
  if(body.userStatus == 1 || body.userStatus == 2){
    let sql = `INSERT into booklevel (floor) VALUE ('${body.content}')`
    database(sql,success,error)
  }else{
    res.status(200).json({
      err_code: 30,
      message: '请不要冒充管理员'
    })
  }
})
/**
 * 查询楼层
 * */
level.get('/allLevel', function (req,res) {
  function success(data){
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
  let sql = `select * from booklevel`
  database(sql,success,error)
})


module.exports = level