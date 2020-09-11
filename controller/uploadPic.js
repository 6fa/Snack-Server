const multer = require('koa-multer');
const fs = require('fs');
const setUpload = function(){
  let storage = multer.diskStorage({
    // 文件保存路径
    destination:function(req,file,cb){
      cb(null, 'public/uploads');
    },
    // 修改文件名称
    filename:function(req,file,cb){
      let fileFormat = (file.originalname).split('.');
      cb(null,Date.now()+'.'+fileFormat[fileFormat.length-1]);
    }
  })
  return multer({storage});
}

const upload = setUpload();
const uploadPic = async (ctx)=>{
  const mongoose = require('mongoose');
  const User = mongoose.model('User');
  const Product = mongoose.model('Product');

  let {id,imgType} = ctx.req.body;
  

  if(imgType == '1'){
    //如果是上传头像，将地址链接存入user数据库
    let picUrl = 'http://192.168.3.5:3000/uploads/'+ ctx.req.file.filename;
    //如果是修改头像，还要将旧头像从数据库删除
    await User.findOne({userName:id}).then(doc => {
      if(!doc.userHead) return;
      let url = doc.userHead.split('3000')[1];
      let path = 'public' + url;
      fs.unlink(path,(err)=>{
        if(err) throw err;
        console.log('删除头像照片成功')
      })
    })
    //修改头像
    await User.findOneAndUpdate({userName:id},{userHead:picUrl},function(err){
      if(err){
        console.log(err);
        ctx.body = {code:500,message:err}
      }else {
        ctx.body = {code:200,filename: picUrl,message:'头像上传成功'}
      }
    })
  }else if(imgType == '2') {
    //如果是上传商品图片，将地址传入product的数据库 
    let picUrl = 'http://192.168.3.5:3000/uploads/'+ ctx.req.file.filename;
    const ObjectId = mongoose.Types.ObjectId;

    await Product.findOneAndUpdate({_id: ObjectId(id)},{productPic:picUrl},function(err){
      if (err) {
        console.log(err);
        ctx.body = {code:500,message:err}
      }else {
        ctx.body = {code:200,filename: picUrl,message:'商品图片上传成功'}
      }
    })
  }

}


module.exports = (router) =>{
  router.post('/upload',upload.single('file'),uploadPic)
}