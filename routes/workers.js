const express = require('express')
const workers = express.Router()
const database = require('../util/db_databsae')
workers.post('/worker/list', function (req, res) {
  let body = req.body
  let sql = `select w.id,
  w.name,
  p.province,
  c.city,
  a.area,
  w.city as cityid,
  w.area as areaid,
  w.province as provinceid,
  w.type as type,
  w.telephone,
  w.remuneration,
  w.count,
  w.createAt,
  w.updateAt
   from workers as w,
  provinces as p,
  cities as c,
  areas as a,
  category as ca
   where p.provinceid = w.province and c.cityid = w.city and a.areaid = w.area and w.type = ca.id`
  if (!body.offset) {
    body.offset = 0
  }
  if (!body.size) {
    body.size = 10
  }
  if (body.name && body.name !== '') {
    sql += ` and w.name like '%${body.name}%'`
  }
  // if (body.type && body.type !== '') {
  //   sql += ` and w.name like '%${body.name}%'`
  // }
  if (body.telephone && body.telephone !== '') {
    sql += ` and telephone like '%${body.telephone}%'`
  }
  sql += ` ORDER BY w.id LIMIT ${body.offset},${body.size}`
  database(sql, success, error)
  function success(data) {
    let list = data
    let count = `SELECT count(*) as totalCount from workers`
    database(count, totalCount, error)
    function totalCount(data) {
      res.status(200).json({
        code: 0,
        data: { list, ...data[0] },
      })
    }
  }

  function error(err) {
    res.status(500).json({
      code: 400,
      data: '查询失败',
      err: err.message,
    })
  }
})
workers.post('/worker', function (req, res) {
  let body = req.body
  let date = new Date()
  console.log(body)
  for (let key in body) {
    if (!body[key] || body[key] == '') {
      res.status(500).json({
        code: 400,
        data: '创建失败',
        err: '请输入正确的格式',
      })
      return
    }
  }
  let sql = `INSERT into workers(name,province,city,area,type,telephone,remuneration,count,createAt,updateAt) VALUES 
  ('${body.name}',
  '${body.province}',
  '${body.city}',
  '${body.area}',
  '${body.type}',
  '${body.telephone}',
  '${body.remuneration}', 
  0 ,
  '${date.toISOString()}',
  '${date.toISOString()}')`
  database(sql, success, error)
  function success(data) {
    res.status(200).json({
      code: 0,
      data: '添加成功',
    })
  }
  function error(err) {
    res.status(500).json({
      code: 400,
      data: '创建用户失败',
      err: err.message,
    })
  }
})
workers.patch('/worker/:id', function (req, res) {
  const id = req.params.id
  const body = req.body
  let date = new Date()
  let sql = `update workers set updateAt = '${date.toISOString()}',`
  if (body.name && body.name !== '') {
    sql += ` name = '${body.name}',`
  }
  if (body.type && body.type !== '') {
    sql += ` type = '${body.type}',`
  }
  if (body.telephone && body.telephone !== '') {
    sql += ` telephone = '${body.telephone}',`
  }
  if (body.remuneration && body.remuneration !== '') {
    sql += ` remuneration = '${body.remuneration}',`
  }
  if (body.province && body.province !== '') {
    sql += ` province = '${body.province}',`
  }
  if (body.city && body.city !== '') {
    sql += ` city = '${body.city}',`
  }
  if (body.area && body.area !== '') {
    sql += ` area = '${body.area}',`
  }
  sql += ` where id = ${id}`
  let last = sql.lastIndexOf(',')
  let totalSql = sql.substring(0, last)
  totalSql += sql.substring(last + 1, sql.length)
  database(totalSql, success, error)
  function success(data) {
    res.status(200).json({
      code: 0,
      data: '修改成功',
    })
  }
  function error(err) {
    res.status(500).json({
      code: 400,
      data: '修改失败',
      err: err.message,
    })
  }
  // console.log(totalSql)
  // console.log(id,body)
})
workers.delete('/worker/:id', function (req, res) {
  const id = req.params.id
  let sql = `delete from workers where id = '${id}'`
  database(sql, success, error)
  function success(data) {
    res.status(200).json({
      code: 0,
      data: '删除成功',
    })
  }
  function error(err) {
    res.status(500).json({
      code: 400,
      data: '删除失败',
      err: err.message,
    })
  }
})
module.exports = workers
