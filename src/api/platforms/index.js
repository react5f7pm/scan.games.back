import Router from 'koa-router'
import platformsCtrl from './platforms.ctrl.js'
import checkLoggedIn from '../../lib/checkLoggedIn.js'

const platforms = new Router()

platforms.post('/', checkLoggedIn, platformsCtrl.create)
platforms.get('/', platformsCtrl.list)

export default platforms