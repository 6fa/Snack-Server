const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const collectSchema = new Schema({
  productId:{type:ObjectId},
  userName:{type:String}
})

mongoose.model('Collect',collectSchema)