const Router = require('koa-router')
const systemCtrl = require('./system.ctrl.js')

const system = new Router()

system.get('/liveCheck', systemCtrl.liveCheck)

module.exports = system