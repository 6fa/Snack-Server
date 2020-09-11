const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const checkCollect = async (ctx) => {
  const Collect = mongoose.model('Collect');
  let {productId,userName} = ctx.request.body;
  let data = {productId:ObjectId(productId),userName};
  await Collect.findOne(data).exec().then(async exist => {
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
const addCollect = async (ctx) => {
  const Collect = mongoose.model('Collect');
  let {productId,userName} = ctx.request.body;
  let data = {productId:ObjectId(productId),userName}
  let newCollect = new Collect(data);

  await newCollect.save().then(async () => {
    //顺便把这条商品下的总数返回去
    await Collect.find({productId:data.productId}).then((collectRes)=>{
      ctx.body = {
        code:200,
        data:collectRes.length,
        message: "收藏成功"
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
const cancelCollect = async (ctx) => {
  const Collect = mongoose.model('Collect');
  let {productId,userName} = ctx.request.body;

  await Collect.deleteOne({productId:Object(productId),userName}).exec().then(async (res,doc)=>{
    //顺便把这条商品下的总数返回去
    await Collect.find({productId:ObjectId(productId)}).then((collectRes)=>{
      ctx.body = {
        code:200,
        data:collectRes.length,
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

//查找某用户的收藏商品
const getUserCollect = async (ctx) => {
  const Product = mongoose.model('Product');
  const Like = mongoose.model('Like');
  const Collect = mongoose.model('Collect');
  let {userName} = ctx.request.body;
  let finalRes = [];
  await Collect.find({userName:userName}).exec().then(async (resArr) => {
    for(let item of resArr){
      await Product.findOne({_id:item.productId}).then(async (pdRes) => {
        await Like.find({productId:pdRes._id}).then(async (likeres)=>{
          pdRes._doc.likeNum = likeres.length;
          await Collect.find({productId:pdRes._id}).then(collectres => {
            pdRes._doc.collectNum = collectres.length;
            finalRes.push(pdRes);
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
      }).catch(err => {
        ctx.body = {
          code:500,
          message:err
        }
      })
    }

    ctx.body = {
      code:200,
      data:finalRes
    }
  }).catch(err => {
    ctx.body = {
      code:500,
      message:err
    }
  })
}
//删除某用户的收藏商品
const delUserCollect = async (ctx) => {
  const Collect = mongoose.model('Collect');
  let {productId,userName} = ctx.request.body;

  await Collect.deleteOne({productId:ObjectId(productId),userName}).then(res => {
    console.log(res);
    ctx.body = {
      code:200,
      message:'取消收藏成功'
    }
  }).catch(err => {
    console.log(err);
    ctx.body = {
      code:500,
      message:err
    }
  })
}

module.exports = {
  addCollect,
  cancelCollect,
  checkCollect,
  getUserCollect,
  delUserCollect
}