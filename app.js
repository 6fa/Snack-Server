const Koa = require('koa');
const app = new Koa();

const bodyParser = require('koa-bodyparser');
const router = require('./router');

const {connect, initSchemas} = require('./database/init.js');

// 跨域
const cors = require('koa2-cors');
//静态文件都放public文件夹

app.use(bodyParser());
app.use(cors());
app.use(require('koa-static')(__dirname+'/public'));

(async ()=> {
  await connect();
  initSchemas(); //载入schemas
})();

router(app);

app.listen(3000, () => {
  console.log('server is running at http://192.168.3.5:3000')
})