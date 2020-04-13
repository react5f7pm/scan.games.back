const jwt = require('jsonwebtoken')

const StatusCode = require('../const/httpStatusCode.js')
const TokenConst = require('../const/token.js')
const User = require('../model/user.js')

const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get('access_token')
  if (!token) return next() // 토큰이 없을 경우 스킵

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    ctx.state.user = {
      _id: decoded._id,
      name: decoded.name
    }

    // 토큰의 남은 유효 기간이 1일 미만이면 재발급
    const now = Math.floor(Date.now() / 1000)
    if ((decoded.exp - now) < TokenConst.DAYS_REQUIRE_REFRESH) {
      const user = await User.findById(decoded._id)
      const token = user.generateToken()
      ctx.cookies.set('access_token', token, {
        maxAge: TokenConst.DAYS_EXPIRES_IN,
        httpOnly: true
      })
    }
    return next()
  }
  catch (e) {
    ctx.throw(StatusCode.INTERNAL_ERROR, e)
  }
}

module.exports = jwtMiddleware
