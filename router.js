const router = require('koa-router')();
const UserController = require('./controller/user');
const getUpload = require('./controller/uploadPic');
const modifyUser = require('./controller/modifyUser');
const publish = require('./controller/publishPd');
const product = require('./controller/product');
const message = require('./controller/message');
const like = require('./controller/like');
const collect = require('./controller/collect');

module.exports = (app) => {
  router.post('/register',UserController.register); //注册
  router.post('/login',UserController.login);   //登录
  router.post('/userinfo',UserController.getUserInfo); //获取用户信息
  router.post('/checkname', UserController.checkName); //检查用户是否存在
  router.post('/checkpwd',UserController.checkPwd); //检查密码是否一致
  router.post('/checktoken',UserController.checkToken); //检查token

  getUpload(router);                                    //上传图片/修改头像

  router.post('/modifypwd',modifyUser.modifyPwd);       //修改密码

  router.post('/publishpd',publish.publishPd);   //发布零食

  router.post('/gethotpd',product.getHotProducts); //获取热门零食
  router.post('/getpd',product.getProducts); //获取零食列表
  router.post('/userpublish',product.getUserPublish); //用户发布过的商品
  router.post('/deluserpublish',product.delUserPublish);//删除用户发布的商品
  router.post('/searchpd',product.searchProduct); //搜索商品

  router.post('/submitmsg',message.writeMsg); //写入留言
  router.post('/getmsgnum',message.getAllMsgNum); //得到留言数目
  router.post('/getmsg',message.getMessage); //得到留言内容
  router.post('/deletemsg',message.deleteMessage); //删除留言

  router.post('/addlike',like.addLike); //保存喜欢数
  router.post('/cancellike',like.cancelLike); //取消喜欢数
  router.post('/checklike',like.checkLike); //取消喜欢数

  router.post('/addcollect',collect.addCollect); //保存收藏数
  router.post('/cancelcollect',collect.cancelCollect); //取消收藏数
  router.post('/checkcollect',collect.checkCollect); //取消收藏数
  router.post('/usercollect',collect.getUserCollect); //得到用户收藏商品
  router.post('/delusercollect',collect.delUserCollect); //删除用户收藏商品

  app.use(router.routes()).use(router.allowedMethods());
}