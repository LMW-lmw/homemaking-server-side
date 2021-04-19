let jwt = require("jsonwebtoken")
function getToken(req,res){
  let token = req.query.token || req.body.token || req.headers.token;
  let flag
  jwt.verify(token,"secret",function (err,decode) {
    if(err){
      flag = false
      return flag
    }else {
      flag = true
      return flag
    }
  })
}

module.exports = getToken