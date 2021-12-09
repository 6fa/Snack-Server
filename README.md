# 零食推荐App的服务端
[snacks-app](https://github.com/6fa/Snack-App)的服务端，主要操作数据库。

## 安装依赖
```
npm install
```
ps：确保已经安装了 Node 和 MongoDB，且已开启MongoDB

## 启动服务
```
node app.js
```

## 目录
- controller        业务逻辑
  - collect.js      增、删、查用户收藏条目
  - like.js         增、删、查用户喜欢条目
  - message.js      增、删、查用户留言
  - modifyUser.js   用户密码修改
  - product.js      增、删、查热门零食及全部零食
  - publishPd.js    用户发布零食
  - uploadPic.js    照片上传
  - user.js         用户注册、登录
- database          数据库
  - schema          各类数据建模
    - collect.js    
    - like.js
    - Message.js
    - Product.js
    - User.js          
  - init.js         初始化数据库、连接数据库
- public            照片存放
- token
  - checkToken.js   检测Token是否过期
  - createToken.js  创建Token
- app.js            入口文件
- router.js         路由
- config.js         配置文件，可设置数据库、启动服务路径