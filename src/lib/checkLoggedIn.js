const StatusCode = require('../const/httpStatusCode.js')

const checkLoggedIn = (ctx, next) => {
  if (!ctx.state.user) {
    ctx.status = StatusCode.INVALID_AUTH
    return
  }
  return next()
}

module.exports = checkLoggedIn