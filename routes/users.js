const express = require('express')
const users = express.Router()
const database = require('../util/db_databsae')
const vertoken = require('../util/token')
/**
 * 用户登录
 *
 */
users.post('/login', function (req, res) {
  let body = req.body
  let sql = `select id,name,enable from user where name = '${body.name}' and password = '${body.password}'`
  database(sql, success, error)
  function success(data) {
    if (data.length === 0) {
      res.status(200).json({
        code: 2,
        data: '用户名或者密码错误',
      })
    } else if (data[0].enable == 0) {
      res.status(200).json({
        code: 1,
        data: '用户已被禁用',
      })
    } else {
      vertoken.setToken(data[0].id).then((token) => {
        data[0].token = token
        res.status(200).json({
          code: 0,
          data: data[0],
        })
      })
    }
  }
  function error(err) {
    res.status(500).json({
      err_code: 500,
      data: err.message,
    })
  }
})
/**
 *  获取用户菜单
 */
users.get('/role/:id/menu', function (req, res) {
  let id = req.params.id
  let sql1 = `select * from menu where id in (select menuid from maprole where roleid = (select roleId from user where id = ${id})) and type = 1`
  let sql2 = `select * from menu where id in (select menuid from maprole where roleid = (select roleId from user where id = ${id})) and type = 2`
  let sql3 = `select * from menu where id in (select menuid from maprole where roleid = (select roleId from user where id = ${id})) and type = 3`
  database(sql1, first, error)
  function first(data) {
    let list = data
    database(sql2, second, error)
    function second(data) {
      for (let x = 0; x < list.length; x++) {
        list[x].children = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].parentId === list[x].id) {
            list[x].children.push(data[i])
          }
        }
      }
      database(sql3, third, error)
      function third(data) {
        for (let x = 0; x < list.length; x++) {
          for (let y = 0; y < list[x].children.length; y++) {
            list[x].children[y].children = []
            for (let i = 0; i < data.length; i++) {
              if (list[x].children[y].id === data[i].parentId) {
                list[x].children[y].children.push(data[i])
              }
            }
          }
        }
        res.status(200).json({
          code: 0,
          data: list,
        })
      }
    }
  }
  function error(err) {
    res.status(500).json({
      code: 500,
      data: err.message,
    })
  }
})

/**
 * 获取用户信息
 *
 */
users.get('/users/:id', function (req, res) {
  let id = req.params.id
  let sql1 = `select id,name,realname,cellphone,enable,createAt,updateAt,roleId,departmentId from user where id = ${id}`
  database(sql1, info, error)
  function info(data) {
    let list = data[0]
    let sql2 = `SELECT * from role where id = ${data[0].roleId}`
    let sql3 = `SELECT * from role where id = ${data[0].departmentId}`
    database(sql2, role, error)
    function role(data) {
      list.role = data[0]
      database(sql3, department, error)
      function department(data) {
        list.department = data[0]
        res.status(200).json({
          code: 0,
          data: list,
        })
      }
    }
  }
  function error(err) {
    res.status(500).json({
      code: 500,
      data: err.message,
    })
  }
})

/**
 * 创建用户
 *
 */
users.post('/users', function (req, res) {
  let body = req.body
  let sql = `SELECT count(*) as count from user where name = '${body.name}'`
  database(sql, success, error)
  function success(data) {
    if (data[0].count !== 0) {
      res.status(200).json({
        data: '用户已存在',
      })
    } else {
      let date = new Date()
      if (!body.password || body.password === '') {
        body.password = 0
      }
      console.log(body.password)
      let insertSql = `INSERT into user(name,password,cellphone,departmentId,roleId,realname,createAt,updateAt) VALUES ('${
        body.name
      }','${body.password}','${body.cellphone}',${body.departmentId},${
        body.roleId
      },'${body.realname}','${date.toISOString()}','${date.toISOString()}')`
      database(insertSql, insertSuccess, error)
      function insertSuccess(data) {
        res.status(200).json({
          code: 0,
          data: '创建用户成功',
        })
      }
    }
  }

  function error(err) {
    res.status(500).json({
      code: 400,
      data: '创建用户失败',
      err: err.message,
    })
  }
})

/**
 * 获取用户列表
 *
 */
users.post('/users/list', function (req, res) {
  let body = req.body
  let sql = `SELECT id,name,enable,cellphone,createAt,updateAt,departmentId,roleId,realname FROM user where 1 = 1`
  if (body.name && body.name !== '') {
    sql += ` and name like '%${body.name}%'`
  }
  if (body.enable !== undefined && body.enable !== '') {
    sql += ` and enable = ${body.enable}`
  }
  if (body.cellphone && body.cellphone !== '') {
    sql += ` and cellphone like '%${body.cellphone}%'`
  }
  if (body.departmentId && body.departmentId !== '') {
    sql += ` and departmentId = ${body.departmentId}`
  }
  if (body.roleId && body.roleId !== '') {
    sql += ` and roleId = ${body.roleId}`
  }
  if (body.realname && body.realname !== '') {
    sql += ` and realname like '%${body.realname}%'`
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
    let count = `SELECT count(*) as totalCount from user`
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
      data: '查询用户失败',
      err: err.message,
    })
  }
})

/**
 * 删除用户
 *
 */
users.delete('/users/:id', function (req, res) {
  const id = req.params.id
  let sql = `delete from user where id = '${id}'`
  database(sql, success, error)
  function success(data) {
    res.status(200).json({
      code: 0,
      data: '删除用户成功',
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
 * 修改用户
 *
 */
users.patch('/users/:id', function (req, res) {
  const id = req.params.id
  const body = req.body
  let date = new Date()
  let sql = `update user set updateAt = '${date.toISOString()}',`
  if (body.name && body.name !== '') {
    sql += ` name = '${body.name}',`
  }
  if (body.realname && body.realname !== '') {
    sql += ` realname = '${body.realname}',`
  }
  if (body.enable !== '' && body.enable !== undefined) {
    sql += ` enable = ${body.enable},`
  }
  if (body.cellphone && body.cellphone !== '') {
    sql += ` cellphone = '${body.cellphone}',`
  }
  if (body.departmentId && body.departmentId !== '') {
    sql += ` departmentId = ${body.departmentId},`
  }
  if (body.roleId && body.roleId !== '') {
    sql += ` roleId = ${body.roleId},`
  }
  if (body.password && body.password !== '') {
    sql += ` password = '${body.password}',`
  }
  sql += ` where id = ${id}`
  let last = sql.lastIndexOf(',')
  let totalSql = sql.substring(0, last)
  totalSql += sql.substring(last + 1, sql.length)
  database(totalSql, success, error)
  function success(data) {
    res.status(200).json({
      code: 0,
      data: '修改用户成功',
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

module.exports = users
