import Router from 'koa-router'

import auth from './auth/index.js'
import games from './games/index.js'
import system from './system/index.js'
import platforms from './platforms/index.js'

const api = new Router()

api.use('/auth', auth.routes())
api.use('/games', games.routes())
api.use('/system', system.routes())
api.use('/platforms', platforms.routes())

export default api
