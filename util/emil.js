const nodemailer=require("nodemailer");


function sendEmile(req,res,to,code,title,callback){
  let transporter = nodemailer.createTransport({//邮件传输
    host:"smtp.qq.com", //qq smtp服务器地址
    secureConnection:false, //是否使用安全连接，对https协议的
    port:465, //qq邮件服务所占用的端口
    auth:{
      user:"3350096172@qq.com",//开启SMTP的邮箱，有用发送邮件
      pass:"djcbehqtqnkedadd"//授权码
    }
  });
  if(title == null){
    title = '天霸动霸'
  }
  let info={
    from:"3350096172@qq.com",
    to: to,//收件人
    subject:"注册校验码",//纯文本
    html:`<h1>欢迎${title}注册系统，您本次的注册验证码为：${code}</h1>`
  }
  //发送邮件
  transporter.sendMail(info,(err,data) => {
    callback && callback(err,data)
  })
}

module.exports = sendEmile