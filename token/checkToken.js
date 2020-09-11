const jwt = require('jsonwebtoken');
// 检查token是否过期
module.exports = async(ctx)=>{
  const authorization = ctx.get('Authorization');
  if(!authorization){
    ctx.throw(401,'no token detected in http headerAuthorization');
  }
  const token = authorization.split(' ')[1];
  let tokenContent;
  try{
    tokenContent = await jwt.verify(token,'luxiaoyue');
  }catch(err){
    ctx.throw(401,'invalid token');
  }
  return tokenContent;
}