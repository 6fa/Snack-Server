const mongoose = require('mongoose');
// const db = "mongodb://localhost/snacks";
const config = require('../config')
const db = config.DBURL
const glob = require('glob');
const {resolve} = require('path');
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);

exports.initSchemas = () => {
  glob.sync(resolve(__dirname,'./schema','**/*.js')).forEach(require);
}

exports.connect = () => {
  // mongoose.connect(db,{ useNewUrlParser: true,useUnifiedTopology: true });
  mongoose.connect(db)

  let maxConnectTimes = 0;

  return new Promise((resolve,reject)=>{
    //增加数据库监听事件
    mongoose.connection.on('disconnected',()=>{
      console.log('******************数据库断开******************')
      if(maxConnectTimes <= 3) {
        maxConnectTimes++;
        mongoose.connect(db);
      }else {
        reject();
        throw new Error('数据库断开');
      }
    })
    mongoose.connection.on('error',(err)=>{
      console.log('******************数据库错误******************')
      if(maxConnectTimes <= 3) {
        maxConnectTimes++;
        mongoose.connect(db);
      }else {
        reject(err);
        throw new Error('数据库错误');
      }
    })
    mongoose.connection.once('open',()=>{
      console.log('mongoDB connected successful');
      resolve();
    })
  })
 
}