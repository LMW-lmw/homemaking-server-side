const express = require('express')
const rack = express.Router()
const database  = require('../util/db_databsae');
/**
 * 修书架信息
 * @param rackId
 * @param content
 * @param userStatus
 * err_code说明
 * 0 成功
 * 30 权限不足
 * 500 错误
 * */
rack.post('/updateRack', function (req, res) {
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
    let sql = `UPDATE bookrack set area = '${body.content}' where id = '${body.rackId}'`
    database(sql,success,error)
  }else{
    res.status(200).json({
      err_code: 30,
      message: '请不要冒充管理员'
    })
  }
})
/**
 * 添加书架
 * @param content
 * @param userStatus
 * err_code说明
 * 0 成功
 * 30 权限不足
 * 500 错误
 * */
rack.post('/addRack', function (req, res) {
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
    let sql = `INSERT into bookrack (floor) VALUE ('${body.content}')`
    database(sql,success,error)
  }else{
    res.status(200).json({
      err_code: 30,
      message: '请不要冒充管理员'
    })
  }
})



module.exports = rack