const express = require('express')
const category = express.Router()
const db = require('../util/db_databsae')
const database = db.connect_database
/**
 * 查询行业分类
 */
category.post('/category/list', function (req, res) {
  let body = req.body
  let sql = `SELECT * from category where 1 = 1`
  let sql2 = ``
  if (body.name && body.name !== '') {
    sql2 += ` and name like '%${body.name}%'`
  }
  if (!body.offset) {
    body.offset = 0
  }
  if (!body.size) {
    body.size = 10
  }
  sql += sql2
  sql += ` LIMIT ${body.offset},${body.size}`
  database(sql, success, error)
  function success(data) {
    let list = data
    let count = `SELECT count(*) as totalCount from category where 1=1`
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
})
/**
 * 修改行业分类
 */
category.patch('/category/:id', function (req, res) {
  const id = req.params.id
  const body = req.body
  let date = new Date()
  let sql = `update category set updateAt = '${date.toISOString()}', name = '${
    body.name
  }' where id = ${id}`
  database(sql, success, error)
  function success(data) {
    res.status(200).json({
      code: 0,
      data: '修改成功',
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
/**
 * 创建行业分类
 */
category.post('/category', function (req, res) {
  const body = req.body
  const name = body.name
  let date = new Date()
  let sql = `select count(*) as count from category where name = '${name}'`
  database(sql, flag, error)
  function flag(data) {
    if (data[0].count !== 0) {
      res.status(200).json({
        data: '行业已存在',
      })
    } else {
      let addSql = `INSERT into category(name,createAt,updateAt) VALUES ('${name}','${date.toISOString()}','${date.toISOString()}')`

      database(addSql, success, error)
      function success(data) {
        res.status(200).json({
          code: 0,
          data: '添加成功',
        })
      }
    }
  }
  function error(err) {
    res.status(500).json({
      code: 400,
      data: '创建失败',
      err: err.message,
    })
  }
})
/**
 * 删除行业分类
 */
category.delete('/category/:id', function (req, res) {
  const id = req.params.id
  let sql = `delete from category where id = '${id}'`
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
module.exports = category
