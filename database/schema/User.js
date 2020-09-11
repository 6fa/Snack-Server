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



userSchema.pre('save', function(next){
  bcrypt.genSalt(saltRounds, (err,salt)=>{
    if(err) return next(err);
    bcrypt.hash(this.password,salt,(err,hash)=>{
      if(err) return next(err);
      this.password = hash;
      next();
    })
  })
}) 

//实例方法：比对密码
userSchema.methods = {
  comparePassword: function(_password,password) {
    return new Promise((resolve,reject)=>{
      bcrypt.compare(_password,password,(err,isMatch)=>{
        if(!err) resolve(isMatch);
        else {
          reject(err);
        }
      })
    })
  }
}


mongoose.model('User',userSchema)