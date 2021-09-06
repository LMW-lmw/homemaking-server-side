const express = require('express')
const test = express.Router()

test.get('/testGet1', (req, res) => {
  setTimeout(() => {
    res.send([
      { id: 1, name: 'lmw', age: 18 },
      { id: 2, name: 'lcl', age: 19 },
    ])
  }, 3000)
})

test.get('/testGet2', (req, res) => {
  setTimeout(() => {
    res.send([
      { id: 1, name: 'zmj', age: 18 },
      { id: 2, name: 'zw', age: 19 },
    ])
  }, 3000)
})
test.get('/testGet3', (req, res) => {
  res.send([
    { id: 1, name: 'zmj', age: 18 },
    { id: 2, name: 'zw', age: 19 },
  ])
})
module.exports = test
