const multer = require('multer')

// let fileFilter = function(req,file,cb){
//   // 当设置这个判断后  没允许的 && 没设置的类型 拒绝
//   // console.log(file.mimetype);   //mimetype文件类型
//   if(file.mimetype === 'image/gif/png'){
//     cb(null,true);//允许
//   }else{
//     req.err = '失败';
//     cb(null,false);
//   }
// }
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img')//设置上传文件的存放路径
  },
  filename: function (req, file, cb) {//设置文件名字
    cb(null, Date.now()+'-'+file.originalname)
  },
})


let upload = multer({
  storage: storage,
  // limits: { fileSize: maxSize },
  // fileFilter:fileFilter
})

module.exports = upload;