import Router from 'koa-router'
import publishersCtrl from './publishers.ctrl.js'
import checkLoggedIn from '../../lib/checkLoggedIn.js'

const publishers = new Router()

publishers.post('/', checkLoggedIn, publishersCtrl.create)
publishers.get('/', publishersCtrl.list)

export default publishers