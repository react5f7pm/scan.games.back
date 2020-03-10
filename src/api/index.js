import Router from 'koa-router'

import auth from './auth/index.js'
import publishers from './publishers/index.js'
import games from './games/index.js'

const api = new Router()

api.use('/auth', auth.routes())
api.use('/games', games.routes())
api.use('/publishers', publishers.routes())

export default api
