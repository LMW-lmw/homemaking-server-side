const express = require('express')
const books = express.Router()
const database  = require('../util/db_databsae');
const md5 = require('blueimp-md5')
const fs = require('fs')
const path = require('path')
//配置文件上传
const upload = require('../util/upload')

/*
* 获取全部书籍
* err_code 返回查询状态
* 0 表示查询成功
* 500 服务器错误
* message 返回给前端的数据
* */
books.get('/getAllBook', function (req,res) {
  let sql = `SELECT book.id,book.bookname,book.details,book.picture,book.qrcode,leve.floor,rack.area,tie.tier,bt.type,book.booknumber,book.borrownum,book.reservenum from books book,booklevel leve,bookrack rack,bookracktier tie,booktype bt WHERE book.floor=leve.id and book.area=rack.id and book.tier=tie.id and book.booktype=bt.id`
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
/**
 * 管理员修改书本信息（前端传入书本的id）
 * @param bookId
 * @param bookname
 * @param userStatus
 * @param details
 * @param floorId
 * @param areaId
 * @param tierId
 * @param typeId
 *
 *
 * 0 表示修改成功
 * 30 权限不够修改失败
 * */
books.post('/updateBook', function (req,res) {
  let body = req.body
  if (body.userStatus == '1'||body.userStatus == '2' ){
    if(body.details==null){
      body.details='暂无'
    }
    let sql = `UPDATE books SET bookname = '${body.bookname}', details = '${body.details}', floor = '${body.floorId}', area = '${body.areaId}', tier = '${body.tierId}', booktype = '${body.typeId}' where id = '${body.bookId}'`
    database(sql,success,error)
    function success(data) {
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
  }
  if(body.userStatus == null || body.userStatus >2 ){
    res.status(200).json({
      err_code: 30,
      message: '请不要冒充管理员'
    })
  }

})
/**
 * 修改书本图片
 * @param bookId
 * @param userStatus
 * err_code : 0|30|2|500  成功｜不是管理员｜上传失败｜服务器错误
 * input的name必须是myfile
 *
 * */
books.post('/updateBookImg',upload.single('myfile'),function (req,res) {
  if (req.file.length === 0) {  //判断一下文件是否存在，也可以在前端代码中进行判断。
    res.status(200).json({
      err_code: 2,
      message: "上传失败"
    })
  }else{
    let picture = req.file.filename
    let body = req.body
    if (body.userStatus == '1'||body.userStatus == '2' ){
      let sql = `update books SET picture = '${picture}' where id = '${body.bookId}'`
      function success(data){
        let delPic = `select picture from books where id = '${body.bookId}'`
        database(delPic,suc,err)
        function suc(data){
          let dPic = data[0].picture
          let url = path.join(__dirname,`../public/img/${dPic}`)
          fs.unlink(url, (err) => {
            if(err) throw err;
          });
        }
        function err(err){
          console.log(err);
        }
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
      database(sql,success,error)
    }
    if(body.userStatus == null || body.userStatus >2 ){
      res.status(200).json({
        err_code: 30,
        message: '请不要冒充管理员'
      })
    }
  }
})
/**
 * 管理员添加书籍
 *  @param bookName
 *  @param details
 *  @param floorId
 *  @param areaId
 *  @param tierId
 *  @param typeId
 *  @param num
 *  @param userStatus
 *
 *  input的name命名必须为addFile
 *  err_code
 *  0:添加成功
 *  30:请不要冒充管理员
 *  500:服务器错误
 * */
books.post('/addBook',upload.single('addFile'), function (req, res) {
  let body = req.body
  let picture = req.file.filename
  if(body.details==null){
    body.details = '暂无'
  }
  if (body.userStatus == '1'||body.userStatus == '2' ){
    let check = `select id,bookname,picture from books where bookname = '${body.bookName}'`
    database(check,checked,error)
    function checked(data){
      if(data.length==0){
        let sql = `Insert into books (bookname,details,status,picture,floor,area,tier,booktype,booknumber) VALUES ('${body.bookName}','${body.details}',2,'${picture}','${body.floorId}','${body.areaId}','${body.tierId}','${body.typeId}','${body.num}')`
        database(sql,success,error)
        function success(data) {
          res.status(200).json({
            err_code: 0,
            message: 'ok'
          })
        }
      }else{
        let id = data[0].id
        let delPic = data[0].picture
        let url = path.join(__dirname,`../public/img/${delPic}`)
        let addNum = `update books set booknumber = booknumber+'${body.num}',picture = '${picture}' where id = '${id}'`
        database(addNum,success,error)
        function success(data) {
          fs.unlink(url, (err) => {
            if(err) throw err;
          });
          res.status(200).json({
            err_code: 0,
            message: 'ok'
          })
        }
      }
    }

    function error(err) {
      res.status(500).json({
        err_code: 500,
        message: err.message
      })
    }
  }else{
    res.status(200).json({
      err_code: 30,
      message: '请不要冒充管理员'
    })
  }
})
/**
 * 删除书籍
 * @param userStatus,
 * @param num
 * @param id
 * */
books.post('/deleteBook', function (req,res) {
  let body = req.body
  let flag = /\d/
  if(!flag.test(body.num)){
    res.status(200).json({
      err_code: 3,
      message: '请输入正规字符'
    })
  }
  let sql = `UPDATE books SET booknumber = booknumber-${body.num} where id = ${body.id}`
  if (body.userStatus == 1 || body.userStatus == 2 ){
    database(sql,success,error)
    function success(data) {
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
  }
  if(body.userStatus == null || body.userStatus >2 ){
    res.status(200).json({
      err_code: 30,
      message: '请不要冒充管理员'
    })
  }
})
/**
 * * 用户借书,还书功能
 *
 * //需要传入的参数
 * @param bookId=>书籍id
 * @param bookName=>书籍
 * @param username=>用户名
 * @param userPassword=>用户密码
 * @param bookStatus=>借书|还书 : 1|2
 * @param borrowTime｜backTime=> 借书时间|还书时间（只能传一个）
 *
 * //借书需要传的参数
 * @param bookId
 * @param username
 * @param userPassword
 * @param userStatus
 * @param bookStatus 1
 * @param borrowTime
 *
 * //还书需要传入的参数
 * @param username
 * @param userPassword
 * @param bookId
 * @param backTime
 * @param bookStatus 2
 *
 * //参数解释
 * body.userId=>用户id
 *
 * err_code解释
 * 500=>服务器报错
 * 0=>操作成功
 * 1=>不是管理员
 * 2=>借书的本书以达到上限
 * 3=>用户名或者密码错误
 * 4=>已被预定
 * 6=>尚未借此书 无法更还
 * */
books.post('/backAndBorrowBook', function (req,res) {
  let body = req.body
  let sql = `UPDATE books SET `
  function error(err){//统一报错
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }
  function success(data) {//统一成功信息
    res.status(200).json({
      err_code: 0,
      message: 'ok'
    })
  }
  if (body.userStatus == '1'||body.userStatus == '2' ){
    // let pass = md5(md5(body.passowrd) + 'lcl')
    let selectId = `select id,identity from user where name = '${body.username}' and password = '${body.userPassword}'`
    database(selectId,selectSuccess,error)
    function selectSuccess(data) {
      if(data.length==0){//判断借书人用户是否存在
        res.status(200).json({
          err_code: 3,
          message: '用户名或者密码错误'
        })
      }else{
        let userId = data[0].id//得到用户的id
        let userIdentity = data.identity//得到用户身份
        if(body.bookStatus=='2'){//还书
          let selectId = `SELECT id,backtime from history his WHERE user = '${userId}' and book = '${body.bookId}'`
          database(selectId,sIdSuccess,error)
          function sIdSuccess(data){
            if(data.length==0 || (data[0].backtime!=null && data[0].backtime!='')){
              res.status(200).json({
                err_code: 6,
                message: '您尚未借此书 无法更还'
              })
            }else{
              let changeId = data[0].id
              let back = `UPDATE history set backtime = '${body.backTime}' WHERE id = '${changeId}'`
              database(back,backSuccess,error)
              function backSuccess(r) {
                let sql = `UPDATE books SET booknumber = booknumber+1, borrownum = borrownum-1 where id = '${body.bookId}'`
                database(sql,success,error)
              }
            }
          }
        }
        if(body.bookStatus=='1'){//借书
          let flag = `SELECT count(*) as num from history where user = '${userId}' and (backtime is null or backtime = '')`
          database(flag,flagSuccess,error)
          function flagSuccess(data){
            let num = data[0].num
            if(num>=3 && userIdentity=='3'){//判断该用户是否可以再次借书（学生可以同时借3本书，老师可以同时借5本）
              res.status(200).json({
                err_code: 2,
                message: '无法再借更多的书了'
              })
            }else if(num>=5 && userIdentity=='4') {
              res.status(200).json({
                err_code: 2,
                message: '无法再借更多的书了'
              })
            }
            else {//可以借书
              let slq1 = `select count(*) num from reserve where userid = '${userId}' and bookid = '${body.bookId}'`
              database(slq1, sql1Success, error)
              function sql1Success(data){
                let sql2 = `select booknumber from books where id = '${body.bookId}'`
                let num = data[0].num//是否预约
                database(sql2,sql2Success,error)
                function sql2Success(data) {
                  let bookNum = data[0].booknumber
                  let flag = `SELECT id,backtime from history his WHERE user = '${userId}' and book = '${body.bookId}'`
                  if(num==0 && bookNum==0){//没预约且没书了
                    res.status(200).json({
                      err_code: 4,
                      message: '已被预约'
                    })
                  }
                  if(num>0 && bookNum>=0){//预定了
                    database(flag, flagsc, error)
                    function flagsc(data){
                      function borrowSuccess(data) {
                        sql+=`borrownum = borrownum+1, reservenum = reservenum-1 where id = '${body.bookId}'`
                        let sql3 = `DELETE FROM reserve where userid='${userId}' and bookid = '${body.bookId}'`
                        database(sql3,sql3Success,error)
                        function sql3Success(){
                          database(sql,success,error)
                        }
                      }
                      if(data.length != 0){
                        let changeId = data[0].id
                        let sql = `UPDATE history set borrowtime = '${body.borrowTime}',backtime = '' WHERE id = '${changeId}'`
                        database(sql,borrowSuccess,error)
                      }else{
                        let borrow = `Insert into history (user,book,borrowtime) values ('${userId}','${body.bookId}','${body.borrowTime}')`
                        database(borrow,borrowSuccess,error)
                      }
                    }
                  }
                  if(num==0 && bookNum>0){//没预定且有书
                    database(flag, flagsc, error)
                    function flagsc(data){
                      function borrowSuccess(data) {
                        sql+=`booknumber = booknumber-1,borrownum = borrownum+1 where id = '${body.bookId}'`
                        database(sql,success,error)
                      }
                      if(data.length != 0){
                        let changeId = data[0].id
                        let sql = `UPDATE history set borrowtime = '${body.borrowTime}',backtime = '' WHERE id = '${changeId}'`
                        database(sql,borrowSuccess,error)
                      }else{
                        let borrow = `Insert into history (user,book,borrowtime) values ('${userId}','${body.bookId}','${body.borrowTime}')`
                        database(borrow,borrowSuccess,error)
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  if(body.userStatus == null || body.userStatus>2){
    res.status(200).json({
      err_code: 1,
      message: '请不要冒充管理员'
    })
  }
})
/**
 * 所有借书记录
 * */
books.get('/getAllHistory', function (req,res) {
  let sql = 'SELECT u.nickname,b.bookname,h.borrowtime,h.backtime from history h,user u,books b WHERE h.user=u.id and h.book=b.id'
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
/**
 * 查询书籍
 * */
books.get('/selectBook', function (req,res) {
  let body = JSON.parse(req.query.obj)
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
  if(body.floor == '' && body.bookName != ''){
    let sql = `SELECT book.id,book.bookname,book.details,book.picture,book.qrcode,leve.floor,rack.area,tie.tier,bt.type,book.booknumber,book.borrownum,book.reservenum from books book,booklevel leve,bookrack rack,bookracktier tie,booktype bt WHERE book.floor=leve.id and book.area=rack.id and book.tier=tie.id and book.booktype=bt.id and book.bookname like '%${body.bookName}%'`
    database(sql,success,error)
  }
  if(body.bookName == '' && body.floor != ''){
    let sql = `SELECT book.id,book.bookname,book.details,book.picture,book.qrcode,leve.floor,rack.area,tie.tier,bt.type,book.booknumber,book.borrownum,book.reservenum from books book,booklevel leve,bookrack rack,bookracktier tie,booktype bt WHERE leve.id=book.floor and leve.id=${body.floor} and book.area=rack.id and book.tier=tie.id and book.booktype=bt.id`
    database(sql,success,error)
  }
  if(body.floor != '' && body.bookName != ''){
    let sql = `SELECT book.id,book.bookname,book.details,book.picture,book.qrcode,leve.floor,rack.area,tie.tier,bt.type,book.booknumber,book.borrownum,book.reservenum from books book,booklevel leve,bookrack rack,bookracktier tie,booktype bt WHERE leve.id=book.floor and leve.id=${body.floor} and book.area=rack.id and book.tier=tie.id and book.booktype=bt.id and book.bookname like '%${body.bookName}%'`
    database(sql,success,error)
  }

})

module.exports = books