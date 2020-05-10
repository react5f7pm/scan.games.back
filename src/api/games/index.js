const Router = require('koa-router')
const gamesCtrl = require('./games.ctrl.js')
const checkLoggedIn = require('../../lib/checkLoggedIn.js')

const games = new Router()

games.post('/', checkLoggedIn, gamesCtrl.create)
games.get('/', gamesCtrl.list)
games.get('/search', gamesCtrl.search)

const game = new Router()
game.get('/', gamesCtrl.read)
game.delete('/', checkLoggedIn, gamesCtrl.remove)
game.patch('/', checkLoggedIn, gamesCtrl.update)

games.use('/:id', game.routes())

module.exports = games