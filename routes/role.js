const express = require('express')
const role = express.Router()
const db = require('../util/db_databsae')
const database = db.connect_database
const promiseDb = db.promise_database
/**
 * 所有角色列表
 */
role.post('/role/list', function (req, res) {
  let body = req.body
  let sql = `SELECT * from role where 1 = 1`
  let sql1 = `SELECT role.id as roleid, m.id,m.name,m.type,m.url,m.parentId,m.children,m.permission,m.icon,m.createAt,m.updateAt from maprole,role as role,menu as m where maprole.roleid = role.id and maprole.menuid = m.id and m.type = 1`
  let sql2 = `SELECT role.id as roleid, m.id,m.name,m.type,m.url,m.parentId,m.children,m.permission,m.icon,m.createAt,m.updateAt from maprole,role as role,menu as m where maprole.roleid = role.id and maprole.menuid = m.id and m.type = 2`
  let sql3 = `SELECT role.id as roleid, m.id,m.name,m.type,m.url,m.parentId,m.children,m.permission,m.icon,m.createAt,m.updateAt from maprole,role as role,menu as m where maprole.roleid = role.id and maprole.menuid = m.id and m.type = 3`

  if (body.name && body.name !== '') {
    sql += ` and name like '%${body.name}%'`
  }
  if (body.intro && body.intro !== '') {
    sql += ` and intro like '%${body.intro}%'`
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
    database(sql1, first, error)
    function first(data) {
      for (let z = 0; z < list.length; z++) {
        list[z].menuList = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].roleid === list[z].id) {
            list[z].menuList.push(data[i])
          }
        }
        // if (list[z].menuList) {
        //   if (list[z].menuList.length == 0) {
        //     list[z].menuList = null
        //   }
        // }
      }
      database(sql2, second, error)
      function second(data) {
        for (let x = 0; x < list.length; x++) {
          for (let e = 0; e < list[x].menuList.length; e++) {
            list[x].menuList[e].children = []
            for (let i = 0; i < data.length; i++) {
              if (
                data[i].parentId === list[x].menuList[e].id &&
                data[i].roleid === list[x].id
              ) {
                list[x].menuList[e].children.push(data[i])
              }
            }

            // 如果没做子菜单则设置成null
            // if (list[x].menuList[e].children) {
            //   if (list[x].menuList[e].children.length == 0) {
            //     list[x].menuList[e].children = null
            //   }
            // }
          }
        }
        database(sql3, third, error)
        function third(data) {
          for (let v = 0; v < list.length; v++) {
            for (let w = 0; w < list[v].menuList.length; w++) {
              for (let q = 0; q < list[v].menuList[w].children.length; q++) {
                list[v].menuList[w].children[q].children = []
                for (let i = 0; i < data.length; i++) {
                  if (
                    data[i].parentId === list[v].menuList[w].children[q].id &&
                    data[i].roleid === list[v].id
                  ) {
                    list[v].menuList[w].children[q].children.push(data[i])
                  }
                }

                // 如果没做子菜单则设置成null
                // if (list[v].menuList[w].children[q].children) {
                //   if (
                //     list[v].menuList[w].children[q].children.length == 0
                //   ) {
                //     list[v].menuList[w].children[q].children = null
                //   }
                // }
              }
            }
          }
          let count = `select count(*) as totalCount from role`
          database(count, getCount, error)
          function getCount(data) {
            res.status(200).json({
              code: 0,
              data: { list, ...data[0] },
            })
          }
        }
      }
    }
  }

  function error(err) {
    res.status(500).json({
      code: 400,
      data: '查询角色列表失败',
      err: err.message,
    })
  }
})

/**
 * 添加角色
 */
role.post('/role', function (req, res) {
  const body = req.body
  const select = `select * from role where name = '${body.name}'`
  database(select, isInsert, error)
  function isInsert(data) {
    if (data.length === 0) {
      const date = new Date()
      const sql = `INSERT into role(name,intro,createAt,updateAt) VALUES ('${
        body.name
      }','${body.intro}','${date.toISOString()}','${date.toISOString()}') `
      database(sql, success, error)
      function success(data) {
        const sql1 = `select id from role where name='${body.name}'`
        database(sql1, getId, error)
        function getId(data) {
          let insert = ``
          for (let i = 0; i < body.menuList.length; i++) {
            insert += `INSERT into maprole(roleid,menuid) VALUES (${data[0].id},${body.menuList[i]});`
          }
          database(insert, succ, error)
          function succ() {
            res.status(200).json({
              data: '添加成功',
            })
          }
        }
      }
    } else {
      res.status(200).json({
        code: 1,
        data: '角色已存在',
      })
    }
  }

  function error(err) {
    res.status(500).json({
      code: 400,
      data: '添加角色列表失败',
      err: err.message,
    })
  }
})

/**
 * 删除角色
 */
role.delete('/role/:id', function (req, res) {
  let id = req.params.id
  let sql = `select id from maprole where roleid = ${id}`
  database(sql, success, error)
  function success(data) {
    let sql2 = `select id from user`
    if (data.length !== 0) {
      sql2 = ``
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          sql2 += `delete from maprole where id = ${data[i].id};`
        }
      }
    }
    database(sql2, delrole, error)
    function delrole() {
      let sql3 = `delete from role where id = ${id}`
      database(sql3, delSuccess, error)
      function delSuccess() {
        res.status(200).json({
          data: '删除成功',
        })
      }
    }
  }
  function error(err) {
    res.status(500).json({
      code: 400,
      data: '查询角色列表失败',
      err: err.message,
    })
  }
})

/**
 * 修改角色
 */
role.patch('/role/:id', function (req, res) {
  const id = req.params.id
  const body = req.body
  let date = new Date()
  let sql = `UPDATE role set updateAt='${date.toISOString()}'`
  if (body.name && body.name !== '') {
    sql += `,name = '${body.name}'`
  }
  if (body.intro && body.intro !== '') {
    sql += `,intro = '${body.intro}'`
  }
  sql += ` where id = ${id}`
  database(sql, roleSucc, error)
  function roleSucc(data) {
    let del = `delete from maprole where roleid = ${id}`
    database(del, delMap, error)
    function delMap(data) {
      let insert = ``
      for (let i = 0; i < body.menuList.length; i++) {
        insert += `INSERT into maprole(roleid,menuid) VALUES (${id},${body.menuList[i]});`
      }
      database(insert, succInsert, error)
      function succInsert() {
        res.status(200).json({
          data: '修改成功',
        })
      }
    }
  }
  function error(err) {
    res.status(500).json({
      code: 400,
      data: '失败',
      err: err.message,
    })
  }
})
module.exports = role
