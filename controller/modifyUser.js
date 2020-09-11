const bcrypt = require('bcrypt');
//密码加密
const encryption = async function(pwd){
  return new Promise((resolve,reject)=>{
    bcrypt.genSalt(10,(err,salt)=>{
      if(err) {
        reject(err);
      }
      bcrypt.hash(pwd,salt,(err,hash)=>{
        if(err) {
          reject(err);
        }
        resolve(hash);
      })
   })
 })
}

//修改密码
const modifyPwd = async (ctx) => {
  const mongoose = require('mongoose');
  const User = mongoose.model('User');
  let {userName,password} = ctx.request.body;
  await encryption(password).then(async (hash)=>{

    password = hash;

    await User.update({userName:userName},{password:password},(err,res)=>{
      if(err){
        console.log(err)
        ctx.body = {
          code:500,
          message:err
        }
      }else {
        console.log('修改成功');
        ctx.body = {
          code:200,
          message:'修改成功'
        }
      }
    })
  }).catch(err => {
    console.log(err);
    ctx.body = {
      code: 500,
      message: err
    }
  })
}

module.exports = {
  modifyPwd
}