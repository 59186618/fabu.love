// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
import router from './controller';
import config from './config';

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
// 导入controller middleware:
const rest = require('./helper/rest')
const serve = require('koa-static');
const cors = require('koa-cors')
const koajwt = require('koa-jwt')
const path = require('path')
const fs = require('fs')
const send = require('koa-send');

const app = new Koa()

// 解决跨域问题
app.use(cors())
app.use(bodyParser())
app.use(serve(config.fileDir))
app.use(serve(__dirname + '/dist'));
app.use(function(ctx,next){
  if (ctx.request.path.indexOf("/api") != 0) {
    // ctx.redirect('/index.html')
      ctx.response.type = 'html';
      ctx.response.body = fs.createReadStream('./dist/index.html');
  }else{
    return next()
  }
})
app.use(koajwt({secret: 'jwt-secret', debug: true}).unless({
  path: ['/api/user/register', '/api/user/login', '/api/swagger', '/api/swagger.json']
}))
app.use(rest.restify())
app.use(router.routes())
console.log(router.routes)
app.use(router.allowedMethods())

export default app.listen(config.port, () => {
  console.log(`App is listening on ${config.port}.`);
});