const mysql  = require('mysql');

const db_config= {
  host: "localhost",
  user: "root",
  password: "root",
  port: "3306",
  database: "library"
}

const pool=mysql.createPool(db_config);

module.exports = function connect_database(sql,callback,errCallback){
  pool.getConnection(function(err,connect){//通过getConnection()方法进行数据库连接
    if(err){
      errCallback(err)
    }else{
      connect.query(sql,function(err,result){
        if(err){
          errCallback(err)
        }else{
          callback(result)
          pool.releaseConnection(connect);//释放连接池中的数据库连接
          // pool.end();//关闭连接池
        }
      });
    }
  });
}