const express = require('express')
const tier = express.Router()
const database  = require('../util/db_databsae');


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
/**
 * 修书架层数信息
 * @param tierId
 * @param content
 * @param userStatus
 * err_code说明
 * 0 成功
 * 30 权限不足
 * 500 错误
 * */
tier.post('/updateTiter', function (req, res) {
  let body = req.body
  if(body.userStatus == 1 || body.userStatus == 2){
    let sql = `UPDATE bookrack set tier = '${body.content}' where id = '${body.tierId}'`
    database(sql,success,error)
  }else{
    res.status(200).json({
      err_code: 30,
      message: '请不要冒充管理员'
    })
  }
})
/**
 * 添加书架层数
 * @param content
 * @param userStatus
 * err_code说明
 * 0 成功
 * 30 权限不足
 * 500 错误
 * */
tier.post('/addTiter', function (req, res) {
  let body = req.body
  if(body.userStatus == 1 || body.userStatus == 2){
    let sql = `INSERT into bookrack (tier) VALUE ('${body.content}')`
    database(sql,success,error)
  }else{
    res.status(200).json({
      err_code: 30,
      message: '请不要冒充管理员'
    })
  }
})



module.exports = tier