const Router = require('koa-router')
const authCtrl = require('./auth.ctrl.js')

const auth = new Router()

auth.post('/signup', authCtrl.signup)
auth.post('/login', authCtrl.login)
auth.post('/logout', authCtrl.logout)

module.exports = auth