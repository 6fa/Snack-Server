const createToken = require('../token/createToken');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// 注册
const register = async (ctx) => {
    const User = mongoose.model('User');
    const newUser = new User();
    const {userName, password} = ctx.request.body
    const encryptedPassword = await newUser.encrypt(password)

    const data = {userName:userName, password:encryptedPassword}
    let addNewUser = new User(data);
    await addNewUser.save().then(()=>{
      // console.log('注册保存', res)
      ctx.body = {
        code: 200,
        message: '注册成功~'
      }
    }).catch(err => {
      console.log(err);
      ctx.body = {
        code: 500,
        message: err
      }
    })
  }

//获取用户信息
const getUserInfo = async (ctx) => {
  const User = mongoose.model('User');
  let {name} = ctx.request.body;
  await User.findOne({userName:name}).exec().then(res => {
    console.log('获取用户信息')
    ctx.body = {
      code:200,
      data:res
    }
  }).catch(err => {
    console.log(err);
    ctx.body = {
      code: 500,
      message: err
    }
  })
}


// 检测是否存在用户
const checkName = async (ctx)=>{
    const User = mongoose.model('User');
    let name = ctx.request.body.userName
    await User.findOne({userName:name}).exec().then(function(result){
      if(result){
        console.log('检查用户是否存在', result);
        ctx.body = {
          code: 200,
          message: true //用户名已存在
        }
      }else {
        ctx.body = {
          code: 200,
          message: false
        }
      }
    }).catch(err => {
      console.log(err);
      ctx.body = {
        code: 500,
        message: err
      }
    })
  }

// 用户登录
const login = async (ctx) => {
    const User = mongoose.model('User');
    let {userName,password} = ctx.request.body;
    console.log('用户登录',userName,password);


    // await User.findOne({userName: userName}).exec(async function(err,result){
    await User.findOne({userName: userName}).exec().then(async function(result){
      if(result){
        //用户名存在再比对密码
        console.log('比对密码',result);
        let newUser = new User();
        await newUser.comparePassword(password,result.password)
        .then(isMatch => {
          console.log('isMatch',isMatch)
          if(isMatch){ //登录成功要创建新的token
            let token = createToken(userName);
            result.token = token;
            ctx.body = {
              code: 200,
              token: token,
              userName:userName,
              userHead:result.userHead,
              message: true //密码一致
            }
          }else {
            ctx.body = {
              code:200,
              message: false
            }
          }
        })
        .catch(err => {
          console.log(err);
          ctx.body = {
            code:500,
            message:err
          }
        })
      }else {
        ctx.body = {
          code: 200,
          message: '用户名不存在'
        }
      }
    })
    .catch(err => {
      console.log(err);
      ctx.body = {
        code: 500,
        message: err
      }
    })
  }

//用户登录状态检测
const checkToken = async (ctx)=>{
  const authorization = ctx.get('Authorization');
  if(!authorization) { //如果不存在
    ctx.body = {
      code:401,
      message: 'no token detected in http headerAuthorization'
    }
  }else {
    let token = authorization.split(' ')[1];
    await jwt.verify(token,'luxiaoyue',function(err,decoded){
      if(err){
        console.log(err)
        ctx.body = {
          code:401,
          message:'invalid token'
        }
      }else {
        console.log(decoded);
        ctx.body = {
          code: 200,
          message: 'valid token'
        }
      }
    })
    
  }

}

//检查密码是否一致
const checkPwd = async (ctx) => {
  const User = mongoose.model('User');
  let {userName,password} = ctx.request.body;

  await User.findOne({userName:userName}).exec().then(async (result) => {
    let newUser = new User();
    await newUser.comparePassword(password,result.password).then(isMatch => {
      if(isMatch) {
        ctx.body = {
          code:200,
          message: true
        }
      }else {
        ctx.body = {
          code: 200,
          message: false
        }
      }
    }).catch(err => {
      console.log(err);
      ctx.body = {
        code: 500,
        message: err
      }
    })
  })

}
module.exports = {
  register,
  getUserInfo,
  checkName,
  login,
  checkToken,
  checkPwd
}