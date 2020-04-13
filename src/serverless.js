const serverless = require('serverless-http')
const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

router.get("/", async (ctx) => {
  ctx.status = 200
  ctx.body = "Hello World!"
});

router.get("/liveCheck", async (ctx) => {
  ctx.status = 200
  ctx.body = 'Live Check:' + Date.now()
})

app.use(router.routes());


const handler = serverless(app);
module.exports.handler = async (event, context) => {
  // you can do other things here
  const result = await handler(event, context);
  // and here
  return result;
};