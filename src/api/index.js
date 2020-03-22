import Router from 'koa-router'

import auth from './auth/index.js'
import platforms from './platforms/index.js'
import games from './games/index.js'

const api = new Router()

api.use('/auth', auth.routes())
api.use('/games', games.routes())
api.use('/platforms', platforms.routes())

export default api
