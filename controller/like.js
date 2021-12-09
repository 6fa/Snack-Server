const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const checkLike = async (ctx) => {
  const Like = mongoose.model('Like');
  let {productId,userName} = ctx.request.body;
  let data = {productId:ObjectId(productId),userName};
  await Like.findOne(data).exec().then(async exist => {
    if(exist){
      ctx.body = {
        code:200,
        existed: true,
        message:'数据已存在'
      }
    }else {
      ctx.body = {
        code:200,
        existed:false,
        message:'数据不存在'
      }
    }
  }).catch(err => {
    ctx.body = {
      code:500,
      message:err
    }
  })
}
//增加喜欢数
const addLike = async (ctx) => {
  const Like = mongoose.model('Like');
  let {productId,userName} = ctx.request.body;
  let data = {productId:ObjectId(productId),userName}
  let newLike = new Like(data);
  let likeNum;

  await newLike.save().then(async () => {
    //顺便把这条商品下的总数返回去
    await Like.find({productId:data.productId}).then((likeRes)=>{
      likeNum = likeRes.length;
      ctx.body = {
        code:200,
        data:likeNum,
        message: "喜欢成功"
      }
    }).catch(err => {
      ctx.body = {
        code:500,
        message:err
      }
    })
  }).catch(err => {
    ctx.body = {
      code:500,
      message:err
    }
  })
}

//取消喜欢
const cancelLike = async (ctx) => {
  const Like = mongoose.model('Like');
  let {productId,userName} = ctx.request.body;
  let likeNum;

  await Like.deleteOne({productId:ObjectId(productId),userName}).exec().then(async (res)=>{
    //顺便把这条商品下的总数返回去
    await Like.find({productId:ObjectId(productId)}).then((likeRes)=>{
      likeNum = likeRes.length;
      ctx.body = {
        code:200,
        data:likeNum,
        message: "取消喜欢成功"
      }
    }).catch(err => {
      ctx.body = {
        code:500,
        message:err
      }
    })
  }).catch(err => {
    ctx.body = {
      code:500,
      message:err
    }
  })
}

module.exports = {
  addLike,
  cancelLike,
  checkLike
}