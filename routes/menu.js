const express = require('express')
const menu = express.Router()
const db = require('../util/db_databsae')
const database = db.connect_database
const promiseDb = db.promise_database
/**
 * 菜单列表
 */
menu.post('/menu/list', function (req, res) {
  let sql1 = `select * from menu where type = 1`
  let sql2 = `select * from menu where type = 2`
  let sql3 = `select * from menu where type = 3`
  // let sql1 = `SELECT role.id as roleid, m.id,m.name,m.type,m.url,m.parentId,m.children,m.permission,m.icon,m.createAt,m.updateAt from maprole,role as role,menu as m where maprole.roleid = role.id and maprole.menuid = m.id and m.type = 1`
  // let sql2 = `SELECT role.id as roleid, m.id,m.name,m.type,m.url,m.parentId,m.children,m.permission,m.icon,m.createAt,m.updateAt from maprole,role as role,menu as m where maprole.roleid = role.id and maprole.menuid = m.id and m.type = 2`
  // let sql3 = `SELECT role.id as roleid, m.id,m.name,m.type,m.url,m.parentId,m.children,m.permission,m.icon,m.createAt,m.updateAt from maprole,role as role,menu as m where maprole.roleid = role.id and maprole.menuid = m.id and m.type = 3`

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
          data: {
            list: list,
          },
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

module.exports = menu
