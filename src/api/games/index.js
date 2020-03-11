import Router from 'koa-router'
import gamesCtrl from './games.ctrl.js'
import checkLoggedIn from '../../lib/checkLoggedIn.js'

const games = new Router()

games.post('/', checkLoggedIn, gamesCtrl.create)
games.get('/', gamesCtrl.list)

const game = new Router()
game.get('/', gamesCtrl.read)
game.delete('/', checkLoggedIn, gamesCtrl.remove)
game.patch('/', checkLoggedIn, gamesCtrl.update)

games.use('/:id', game.routes())

export default games