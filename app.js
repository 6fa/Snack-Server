const Koa = require('koa');
const app = new Koa();
const config = require('./config')

// const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body')
const router = require('./router');

const {connect, initSchemas} = require('./database/init.js');

// 跨域
const cors = require('koa2-cors');


// app.use(bodyParser());
app.use(koaBody())
app.use(cors());
//静态文件都放public文件夹
app.use(require('koa-static')(__dirname+'/public'));

(async ()=> {
  await connect();
  initSchemas(); //载入schemas
})();

router(app);

app.listen(config.PORT, () => {
  console.log(`server is running at ${config.BASEURL}`)
})
