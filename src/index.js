const dotEnv = require('dotenv')
dotEnv.config()

const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')

const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')

const api = require('./api/index.js')
const jwtMiddleware = require('./lib/jwtMiddleware.js')

const { PORT, MONGO_URI } = process.env

const app = new Koa()
const router = new Router()

mongoose
  .connect(MONGO_URI, { 
    useNewUrlParser:true, 
    useFindAndModify: false,
    useUnifiedTopology: true, // 해당 옵션을 생성자에 넘겨주지 않으면 노드 경고
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(e => {
    console.error(e)
  })

// Web API 라우트 설정
router.use('/api', api.routes())

// 앱에 라우터 적용전에 BodyParser 적용
app.use(bodyParser())

// JWT 토큰 검증
app.use(jwtMiddleware)

// CORS
app.use(cors())

// 앱 인스턴스에 라우터 적용
app.use(router.routes())

const port = PORT || 4000
app.listen(port, () => {
  console.log("listening to port %d", port)
})

module.exports = app
