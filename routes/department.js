const express = require('express')
const department = express.Router()
const database = require('../util/db_databsae')

/**
 * 部门列表
 */
department.post('/department/list', function (req, res) {
  let body = req.body
  let sql = `SELECT * from department where 1 = 1`
  if (body.name && body.name !== '') {
    sql += ` and name like '%${body.name}%'`
  }
  if (body.leader && body.leader !== '') {
    sql += ` and enable like '%${body.leader}%'`
  }
  if (body.createAt && body.createAt !== '') {
    let begin = body.createAt[0]
    let end = body.createAt[1]
    sql += ` and createAt between '${begin}' and '${end}'`
  }
  if (!body.offset) {
    body.offset = 0
  }
  if (!body.size) {
    body.size = 10
  }
  sql += ` LIMIT ${body.offset},${body.size}`
  database(sql, success, error)
  function success(data) {
    let list = data
    let count = `SELECT count(*) as totalCount from department`
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
      data: '查询部门失败',
      err: err.message,
    })
  }
})
/**
 * 添加部门
 */
department.post('/department', function (req, res) {
  let body = req.body
  let date = new Date()
  let select = `select * from department where name = '${body.name}'`
  database(select, insert, error)
  function insert(data) {
    if (data.length === 0) {
      let sql = `INSERT into department(name,leader,createAt,updateAt) VALUES ('${
        body.name
      }','${body.leader}','${date.toISOString()}','${date.toISOString()}') `
      database(sql, success, error)
      function success(data) {
        res.status(200).json({
          code: 0,
          data: '添加成功',
        })
      }
    } else {
      res.status(401).json({
        code: 1,
        data: '部门已存在',
      })
    }
  }

  function error(err) {
    res.status(500).json({
      code: 400,
      data: '查询部门失败',
      err: err.message,
    })
  }
})
/**
 * 修改部门
 */
department.patch('/department/:id', function (req, res) {
  const body = req.body
  const id = req.params.id
  let date = new Date()
  let sql = `update department set updateAt = '${date.toISOString()}',`
  if (body.name && body.name !== '') {
    sql += ` name = '${body.name}',`
  }
  if (body.leader && body.leader !== '') {
    sql += ` leader = '${body.leader}',`
  }
  sql += ` where id = ${id}`
  let last = sql.lastIndexOf(',')
  let totalSql = sql.substring(0, last)
  totalSql += sql.substring(last + 1, sql.length)
  database(totalSql, success, error)
  function success(data) {
    res.status(200).json({
      code: 1,
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
})
/**
 * 删除部门
 */
department.delete('/department/:id', function (req, res) {
  const id = req.params.id
  let sql = `delete from department where id = '${id}'`
  database(sql, success, error)
  function success(data) {
    res.status(200).json({
      code: 0,
      data: '删除部门成功',
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
module.exports = department
