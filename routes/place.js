const express = require('express')
const place = express.Router()
const database  = require('../util/db_databsae');

/**
 * 书籍预定功能
 * @param bookId
 * @param userId
 * @param time
 * err_code
 * 0 预约成功
 * 2 预约数量达到上限
 * 500 服务器错误
 * */
place.post('/reserveBook', function (req, res) {
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
  let body = req.body
  let sql1 = `select count(*) num from reserve where userid = '${body.userId}'`
  database(sql1, sql1Success ,error)
  function sql1Success(data){
    let num = data[0].num
    if(num>5){
      res.status(200).json({
        err_code: 2,
        message: '预约数量达到上限'
      })
    }else{
      let sql = `insert into reserve(userid,bookid,reservetime) values ('${body.bookId}','${body.userId}','${body.time}')`
      database(sql, sqlSuccess, error)
      function sqlSuccess(data) {
        let sql2 = `update books set booknumber = booknumber-1,reservenum = reservenum+1 where id = '${body.bookId}'`
        database(sql2, success, error)
      }
    }
  }
})

/**
 * 取消预定
 * @param bookId
 * @param userId
 * err_code
 * 0 取消成功
 * 500 服务器错误
 * */
place.post('/cancelBook', function (req, res) {
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
  let sql = `DELETE FROM reserve where userid='${body.userId}' and bookid = '${body.bookId}'`
  database(sql,sqlSuccess,error)
  function sqlSuccess(data) {
    let sql1 = `update books set booknumber = booknumber+1,reservenum = reservenum-1 where id = '${body.bookId}'`
    database(sql1, success, error)
  }
})

/**
 * 书籍评论
 * @param bookId
 * @param userId
 * @param content
 * @param time
 * err_code说明
 * 0 成功
 * 2 尚未借此书无法评论
 * 500 服务器问题
 * */
place.post('/addRemark', function (req, res) {
  let body = req.body
  console.log(body);
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
  let flag = `select count(*) num from history where user = '${body.userId}' and book = '${body.bookId}'`
  database(flag,flagSuccess,error)
  function flagSuccess(data){
    let num = data[0].num
    if(num!=0){
      let nums = `select count(*) num from remark where belong = '${body.userId}' and book = '${body.bookId}'`
      database(nums,numsSuccess,error)
      function numsSuccess(data){
        if(data[0].num!=0){
          let sql1 = `update remark set content = '${body.content}',remarktime = '${body.time}' where belong = '${body.userId}' and book = '${body.bookId}'`
          database(sql1,success,error)
        }else{
          let sql2 = `INSERT into remark (belong,book,content,remarktime) VALUES ('${body.userId}',${body.bookId},'${body.content}','${body.time}')`
          database(sql2,success,error)
        }
      }
    }else{
      res.status(200).json({
        err_code: 2,
        message: '尚未借此书无法评论'
      })
    }
  }
})



module.exports = place