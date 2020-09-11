const publishPd = async (ctx) => {
  const mongoose = require('mongoose');
  const Product = mongoose.model('Product');

  let newProduct = new Product(ctx.request.body);
  await newProduct.save().then((res)=>{
    ctx.body = {
      code: 200,
      message: '发布成功',
      productId: res._id
    }
  }).catch(err => {
    console.log(err);
    ctx.body = {
      code: 500,
      message: err
    }
  })
}

module.exports = {
  publishPd
}