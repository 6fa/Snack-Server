const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

//得到留言总数目
const getAllMsgNum = async (ctx) => {
  const Message = mongoose.model('Message');
  const SubMessage = mongoose.model('SubMessage');
  let {productId} = ctx.request.body;
  await Message.find({proId:productId}).exec().then(async msgres => {
    let msgNum = msgres.length;
    let subMsgTotal = 0;
    for(let item of msgres){
      let msgId = item._id;
      await SubMessage.find({msgId:msgId}).exec().then(submsgres => {
        let subMsgNum = submsgres.length;
        subMsgTotal = Number(subMsgTotal) + Number(subMsgNum);
      }).catch(err => {
        ctx.body = {
          code:500,
          Message:err
        }
      }) 
    }
    let total = msgNum + subMsgTotal;
    ctx.body = {
      code:200,
      data:total
    }
  }).catch(err => {
    ctx.body = {
      code:500,
      Message:err
    }
  })
}

//留言写入
const writeMsg = async (ctx) => {
  const Message = mongoose.model('Message');
  const SubMessage = mongoose.model('SubMessage');

  let {data,type} = ctx.request.body;
  let newMsg;
  if(type == 1){
    newMsg = new Message(data);
  }else if(type == 2){
    newMsg = new SubMessage(data);
  }
  await newMsg.save().then(res => {
    ctx.body = {
      code:200,
      message:'留言成功'
    }
  }).catch(err => {
    ctx.body = {
      code:500,
      message:err
    }
  })
}

//得到一级留言 或者 二级留言
const getMessage = async (ctx) => {
  const Message = mongoose.model('Message');
  const SubMessage = mongoose.model('SubMessage');

  let {id,type,pageNum,pageSize} = ctx.request.body;
  let model,idType;
  if(type == 1){
    model = Message;
    idType = 'proId';
  }else if(type == 2){
    model = SubMessage;
    idType = 'msgId'
  }

  await model.find({[idType]:id})
    .skip(pageNum*pageSize)
    .limit(pageSize)
    .exec()
    .then(async res => {
      if(type == 1){
        //如果是一级留言，还需要返回对应二级留言的数量
        for(let item of res){
          await SubMessage.find({msgId:item._id}).exec().then(subres => {
            item._doc.subMsgNum = subres.length;
          }).catch(err => {
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
      }else{
        ctx.body = {
          code:200,
          data:res
        }
      }
    })
    .catch(err => {
      ctx.body = {
        code:500,
        message:err
      }
    })

}

//删除一级留言 或 二级留言
const deleteMessage =async (ctx) => {
  const Message = mongoose.model('Message');
  const SubMessage = mongoose.model('SubMessage');

  let {id,type} =ctx.request.body,data,model;
  if(type==1){
    data = {_id:ObjectId(id)};
    model = Message;
  }else if(type==2){
    data = {_id:ObjectId(id)};
    model = SubMessage;
  }
 
  await model.deleteOne(data).exec().then(res => {

    ctx.body = {
      code:200,
      message:'删除成功'
    }
  }).catch(err => {
    ctx.body = {
      code:500,
      message: err
    }
  })
}


module.exports = {
  getAllMsgNum,
  writeMsg,
  getMessage,
  deleteMessage
}