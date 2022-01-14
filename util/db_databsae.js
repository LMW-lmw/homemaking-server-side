const mysql = require('mysql')

const db_config = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: '3306',
  database: 'cms',
  multipleStatements: true, // 支持执行多条 sql 语句
}

const pool = mysql.createPool(db_config)
function promise_database(sql) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connect) {
      //通过getConnection()方法进行数据库连接
      if (err) {
        reject(err)
      } else {
        connect.query(sql, function (err, result) {
          if (err) {
            reject(err)
          } else {
            resolve(result)
            pool.releaseConnection(connect) //释放连接池中的数据库连接
            // pool.end();//关闭连接池
          }
        })
      }
    })
  })
}
function connect_database(sql, callback, errCallback) {
  pool.getConnection(function (err, connect) {
    //通过getConnection()方法进行数据库连接
    if (err) {
      errCallback(err)
    } else {
      connect.query(sql, function (err, result) {
        if (err) {
          errCallback(err)
        } else {
          callback(result)
          pool.releaseConnection(connect) //释放连接池中的数据库连接
          // pool.end();//关闭连接池
        }
      })
    }
  })
}

module.exports = { promise_database, connect_database }
