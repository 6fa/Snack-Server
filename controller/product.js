const mongoose = require('mongoose');
const fs = require('fs');
//得到普通商品列表
const getProducts = async (ctx) => {
  const Product = mongoose.model('Product');
  const Like = mongoose.model('Like');
  const Collect = mongoose.model('Collect');
  let {pageNum,pageSize} = ctx.request.body;

  await Product.find({})
    .sort({'_id':-1})
    .skip(pageNum*pageSize)
    .limit(pageSize)
    .exec()
    .then(async (docs)=>{
      for(let item of docs){
        await Like.find({productId:item._id}).exec().then(async (likeres) => {
          item._doc.likeNum = likeres.length;
          await Collect.find({productId:item._id}).exec().then(async colres => {
            item._doc.collectNum = colres.length;
          }).catch(err => {
            console.log(err)
            ctx.body = {
              code:500,
              message:err
            }
          })
        }).catch(err => {
          console.log(err)
          ctx.body = {
            code:500,
            message:err
          }
        })
      }
      ctx.body = {
        code:200,
        data:docs,
        message:'获取商品成功'
      }
    })
    .catch(err => {
      console.log(err)
      ctx.body = {
        code:500,
        message:err
      }
    })

}

//查找某用户发布过的商品
const getUserPublish = async (ctx) => {
  const Product = mongoose.model('Product');
  const Like = mongoose.model('Like');
  const Collect = mongoose.model('Collect');
  let {userName} = ctx.request.body;
  await Product.find({publisher:userName}).exec().then(async res => {
    for(let item of res){
      await Like.find({productId:item._id}).exec().then(async (likeres) => { //喜欢的数量
          item._doc.likeNum = likeres.length;
          await Collect.find({productId:item._id}).exec().then(async colres => { //收藏的数量
            item._doc.collectNum = colres.length;
          }).catch(err => {
            console.log(err)
            ctx.body = {
              code:500,
              message:err
            }
          })
        }).catch(err => {
          console.log(err)
          ctx.body = {
            code:500,
            message:err
          }
        })
    }
    ctx.body = {
      code:200,
      data:res
    }
  }).catch(err => {
    console.log(err);
    ctx.body = {
      code:500,
      message:err
    }
  })
}

//删除用户发布的商品
const delUserPublish = async (ctx) => {
  const Product = mongoose.model('Product');

  let {_id,publisher} = ctx.request.body;
  await Product.findOne({_id}).then(doc => {
    if(!doc.productPic)return;
    let url = doc.productPic.split('3000')[1];
    let path = 'public' + url;
    fs.unlink(path,(err)=>{
      if(err) throw err;
      console.log('删除商品照片成功')
    })
  })
  await Product.deleteOne({_id,publisher}).then(res => {
    console.log(res);
    ctx.body = {
      code:200,
      message:'删除发布成功'
    }
  }).catch(err => {
    console.log(err);
    ctx.body = {
      code:500,
      message:err
    }
  })
}


//热榜商品
const getHotProducts =async (ctx) => {
  // const mongoose = require('mongoose');
  const Product = mongoose.model('Product');
  const Like = mongoose.model('Like');
  const Collect = mongoose.model('Collect');
  let {num} = ctx.request.body;


  await Like.aggregate([
    {$group:{_id:"$productId",like_total:{$sum:1}}},  //对每种商品的喜欢数目进行统计并且排序
    {$sort:{like_total:1}}
  ]).exec().then(async (docs)=>{
    let newArr = docs.slice(-num);
    let productArr = [];
    for(let val of newArr){
      await Product.findOne({_id:val._id}).exec().then(async function(result){ //找到商品的具体数据
        if(result){
          result._doc.likeNum = val.like_total;
          await Collect.find({productId:val._id}).exec().then(res => { //获取收藏数
            result._doc.collectNum = res.length;
          }).catch(err => {
            console.log(err);
            ctx.body = {
              code:500,
              message: err
            }
          })
          productArr.push(result);
        }
      }).catch(err => {
        console.log(err);
        ctx.body = {
          code:500,
          message:err
        }
      })
    }
    ctx.body = {
      code:200,
      data:productArr,
      message:'获取热门商品成功'
    }
  }).catch(err => {
    console.log(err);
    ctx.body = {
      code:500,
      message: err
    }
  })


}

//搜索商品
const searchProduct = async (ctx) => {
  const Product = mongoose.model('Product');
  const Like = mongoose.model('Like');
  const Collect = mongoose.model('Collect');
  let {text,pageNum,pageSize} = ctx.request.body;
  console.log(text,pageNum,pageSize)
  await Product.where('productName').regex(new RegExp(text,'i'))
    .skip(pageNum*pageSize)
    .limit(pageSize)
    .exec()
    .then(async res => {
      for(let item of res){
        await Like.find({productId:item._id}).exec().then(async (likeres) => {
          item._doc.likeNum = likeres.length;
          await Collect.find({productId:item._id}).exec().then(async colres => {
            item._doc.collectNum = colres.length;
          }).catch(err => {
            console.log(err)
            ctx.body = {
              code:500,
              message:err
            }
          })
        }).catch(err => {
          console.log(err)
          ctx.body = {
            code:500,
            message:err
          }
        })
      }
      ctx.body = {
        code:200,
        data:res
      }
    })
    .catch(err => {
      ctx.body = {
        code:500,
        message:err
      }
    })
  
}


module.exports = {
  getHotProducts,
  getProducts,
  getUserPublish,
  delUserPublish,
  searchProduct
}