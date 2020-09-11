const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const productSchema = new Schema({
  productId:{type:ObjectId}, //商品id
  publisher: {type:String}, //发布人 userName
  content: {type:String}, //商品内容描述
  price: {type:Number}, //商品价格
  productPic: {type:String}, //商品图片
  productName: {type:String}, //商品名称
  time: {type:Date,default:Date.now()} //发布时间
})


mongoose.model('Product',productSchema); 