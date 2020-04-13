const Router = require('koa-router')

const auth = require('./auth/index.js')
const games = require('./games/index.js')
const system = require('./system/index.js')

const api = new Router()

api.use('/auth', auth.routes())
api.use('/games', games.routes())
api.use('/system', system.routes())

module.exports = api
