const express = require('express')
const test = express.Router()
const db = require('../util/db_databsae')
const database = db.connect_database

test.post('/citys', function (req, res) {
  let body = req.body
  let sql = ''
  if (body.city) {
    sql = `SELECT city from cities where city like '%${body.city}%'`
  } else {
    sql = 'SELECT city from cities'
  }

  console.log(sql)
  database(sql, success, error)
  function success(data) {
    res.status(200).json({
      code: 0,
      data,
    })
  }

  function error(err) {
    res.status(500).json({
      code: 500,
      data: err.message,
    })
  }
})
module.exports = test
