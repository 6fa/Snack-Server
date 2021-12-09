// const multer = require('koa-multer');
const fs = require('fs');
const koaBody = require('koa-body');
const path = require('path');
const config = require('../config')
// const setUpload = function(){
//   let storage = multer.diskStorage({
//     // 文件保存路径
//     destination:function(req,file,cb){
//       cb(null, 'public/uploads');
//     },
//     // 修改文件名称
//     filename:function(req,file,cb){
//       let fileFormat = (file.originalname).split('.');
//       cb(null,Date.now()+'.'+fileFormat[fileFormat.length-1]);
//     }
//   })
//   return multer({storage});
// }

// const upload = setUpload();
const uploadPic = async (ctx)=>{
  const mongoose = require('mongoose');
  const User = mongoose.model('User');
  const Product = mongoose.model('Product');

  //let {id,imgType} = ctx.req.body;
  let {id,imgType} = ctx.request.body
  

  if(imgType == '1'){
    //如果是上传头像，将地址链接存入user数据库
    //let picUrl = 'http://localhost:3001/uploads/'+ ctx.req.file.filename;
    const file = ctx.request.files.file
    let picUrl = `${config.BASEURL}/uploads/`+ file.name;
    const doc = await User.findOne({userName:id})
    console.log('修改头像之前的doc', doc)
    const oldhead = doc.userHead
    try {
      doc.userHead = picUrl;
      doc.save()
      console.log('修改头像之后的doc', doc)
      ctx.body = {code:200,filename: picUrl,message:'头像上传成功'}
    }catch(err) {
      ctx.body = {code:500,message:err}
    }

    //如果已经有头像照片，删除旧的
    if(oldhead){
      let url = oldhead.split('3001')[1]
      let path = 'public' + url
      fs.access(path, (err)=>{
        if(err){
          console.log('文件不存在')
        }else {
          fs.unlink(path,(err)=>{
            if(err){
              console.log('删除头像失败',err)
            }else {
              console.log('删除头像照片成功')
            }
          })
        }
      })
    }
  }else if(imgType == '2') {
    //如果是上传商品图片，将地址传入product的数据库 
    // let picUrl = 'http://localhost:3001/uploads/'+ ctx.req.file.filename;
    let picUrl = `${config.BASEURL}/uploads/`+ ctx.request.files.file.name;

    const ObjectId = mongoose.Types.ObjectId;
    try {
      await Product.findOneAndUpdate({_id: ObjectId(id)},{productPic:picUrl})
      ctx.body = {code:200,filename: picUrl,message:'商品图片上传成功'}
    }catch(err){
      ctx.body = {code:500,message:err}
    }

    // await Product.findOneAndUpdate({_id: ObjectId(id)},{productPic:picUrl},function(err){
    //   if (err) {
    //     console.log(err);
    //     ctx.body = {code:500,message:err}
    //   }else {
    //     ctx.body = {code:200,filename: picUrl,message:'商品图片上传成功'}
    //   }
    // })
  }

}


module.exports = (router) =>{
  // router.post('/upload',upload.single('file'),uploadPic)
  router.post('/upload', koaBody({
    multipart:true,
    formidable:{
      uploadDir:path.join(__dirname,'../public/uploads'),
      keepExtensions: true,
      onFileBegin(name,file){
        const dir = path.join(__dirname,'../public/uploads')
        //检查public下是否有uploads文件夹，没有则创建
        if(!fs.existsSync(dir)){
          fs.mkdirSync(dir)
        }
        const filename = Date.now()
        file.name = filename
        file.path= `${dir}/${file.name}`
      },
      onError:(err)=>{
        console.log("文件上传出错",err);
      }
    }
  }),
  uploadPic
  )
}