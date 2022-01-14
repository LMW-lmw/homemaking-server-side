const express = require('express')
const echarts = express.Router()
const db = require('../util/db_databsae')
const database = db.connect_database
const promiseDb = db.promise_database
echarts.get('/echart/worker/top', function (req, res) {
  let sql = `SELECT id,name,count  from workers ORDER BY count desc LIMIT 0,10`
  database(sql, success, error)
  function success(data) {
    res.status(200).json({
      code: 0,
      data: data,
    })
  }
  function error(err) {
    res.status(500).json({
      code: 500,
      data: err.message,
    })
  }
})
echarts.get('/echart/catary/top', function (req, res) {
  let sql = `SELECT c.id,c.name, count(*) as count from workers w JOIN category c ON w.type=c.id GROUP BY c.id`
  database(sql, success, error)
  function success(data) {
    res.status(200).json({
      code: 0,
      data: data,
    })
  }
  function error(err) {
    res.status(500).json({
      code: 500,
      data: err.message,
    })
  }
})
module.exports = echarts
