const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new Schema({
  // userId: ObjectId,和下面一样
  // userId: {type:ObjectId},
  userName: {unique:true,type:String},
  password:{type:String},
  userHead: {type:String},
  token: {type: String},
});



// userSchema.pre('save', function(next){
//   bcrypt.genSalt(saltRounds, (err,salt)=>{
//     if(err) {
//       console.log('加密错误')
//       return next(err);
//     }
//     bcrypt.hash(this.password,salt,(err,hash)=>{
//       if(err) {
//         console.log('加密错误')
//         return next(err);
//       }
//       this.password = hash;
//       console.log('加密后的密码',this.password)
//       next();
//     })
//   })
// }) 

//实例方法
userSchema.methods = {
  //比对密码
  comparePassword: function(_password,password) {
    return new Promise((resolve,reject)=>{
      bcrypt.compare(_password,password,(err,isMatch)=>{
        console.log("----比对密码----")
        console.log(_password)
        console.log(password)
        if(!err) resolve(isMatch);
        else {
          reject(err);
        }
      })
    })
  },
  //加密
  encrypt: function(plaintextPassword){
    return new Promise((resolve,reject)=>{
      bcrypt.hash(plaintextPassword, saltRounds, function(err, hash){
        console.log("----加密----")
        if(!err) resolve(hash);
        else {
          reject(err);
        }
      })
    })
  }
}


mongoose.model('User',userSchema)