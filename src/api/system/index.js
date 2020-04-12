import Router from 'koa-router'
import systemCtrl from './system.ctrl.js'

const system = new Router()

system.get('/liveCheck', systemCtrl.liveCheck)

export default system