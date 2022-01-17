const express = require('express')
const workers = express.Router()
const db = require('../util/db_databsae')
const database = db.connect_database
const promiseDb = db.promise_database

/**
 * 查询家政人员
 */
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
  ca.name as type,
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
  let sql2 = ``
  async function selectWorkers() {
    if (!body.offset) {
      body.offset = 0
    }
    if (!body.size) {
      body.size = 10
    }
    if (body.name && body.name !== '') {
      sql2 += ` and w.name like '%${body.name}%'`
    }
    if (body.telephone && body.telephone !== '') {
      sql2 += ` and w.telephone like '%${body.telephone}%'`
    }
    if (body.type && body.type !== '') {
      let selectCategoryId = `select id from category where name = "${body.type}"`
      let info = await promiseDb(selectCategoryId)
      let type = info[0].id
      sql2 += ` and w.type = ${type}`
    }
    sql += sql2
    sql += ` ORDER BY w.id LIMIT ${body.offset},${body.size}`
    database(sql, success, error)
    function success(data) {
      let list = data
      let count = `SELECT count(*) as totalCount from workers w where 1=1`
      count += sql2
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
  }
  selectWorkers()
})

/**
 * 添加家政人员
 */
workers.post('/worker', function (req, res) {
  let body = req.body
  let date = new Date()
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
  async function addWorker() {
    let selectTypeId = `select id from category where name = "${body.type}"`
    let info = await promiseDb(selectTypeId)
    let type = info[0].id
    let sql = `INSERT into workers(name,province,city,area,type,telephone,remuneration,count,createAt,updateAt) VALUES 
  ('${body.name}',
  '${body.province}',
  '${body.city}',
  '${body.area}',
  ${type},
  '${body.telephone}',
  '${body.remuneration}', 
  0 ,
  '${date.toISOString()}',
  '${date.toISOString()}')`

    database(sql, success, error)
    function success() {
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
  }
  addWorker()
})
/**
 * 修改家政人员信息
 */
workers.patch('/worker/:id', function (req, res) {
  const id = req.params.id
  const body = req.body
  let date = new Date()
  let sql = `update workers set updateAt = '${date.toISOString()}',`
  async function editWorker() {
    if (body.name && body.name !== '') {
      sql += ` name = '${body.name}',`
    }
    if (body.type && body.type !== '') {
      let selectTypeId = `select id from category where name = '${body.type}'`
      const info = await promiseDb(selectTypeId)
      const typeid = info[0].id
      sql += ` type = ${typeid},`
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
  }
  editWorker()
})

/**
 * 删除家政人员信息
 */
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
