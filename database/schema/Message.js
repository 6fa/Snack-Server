const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const msgSchema = new Schema({
  msgId:{type:ObjectId}, //留言id
  proId:{type:String}, //商品id
  msgContent:{type:String}, //留言内容
  publisher: {type:String}, //留言发布者id
  time:{type:Date,default:Date.now()}, //留言时间
  replyTo: {type:String}, //回复的是谁，username
})
const subMsgSchema = new Schema({
  msgId:{type:String},   //哪条一级留言下的
  subMsgId:{type:ObjectId}, //二级留言id
  subMsgContent:{type:String}, //二级留言内容
  time:{type:Date,default:Date.now()}, //二级留言时间
  publisher:{type:String},//二级留言发布者
  replyTo: {type:String}, //回复的是谁，username
})

mongoose.model('Message',msgSchema);
mongoose.model('SubMessage',subMsgSchema); 