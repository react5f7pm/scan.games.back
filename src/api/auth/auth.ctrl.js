const Joi = require('joi')

const StatusCode = require('../../const/httpStatusCode.js')
const TokenConst = require('../../const/token.js')
const User = require('../../model/user.js')

/*
 * POST /api/auth/signup
 * {
 *   name: 'enttt',
 *   password: 'my-pass'
 * }
 */
const signup = async ctx => {
  // Request Body 검증
  const schema = Joi.object().keys({
    name: Joi.string()
      .alphanum()
      .min(3)
      .max(20)
      .required(),
    email: Joi.string().required(),
    password: Joi.string().required()
  })
  const result = Joi.validate(ctx.request.body, schema)
  if (result.error) {
    ctx.status = StatusCode.INVALID_PARAMS
    ctx.body = result.error
    return
  }

  const { name, email, password } = ctx.request.body
  try {
    // Username 이 이미 존재하는지 확인
    const exists = await User.findByName(name)
    if (exists) {
      ctx.status = StatusCode.CONFLICT
      return
    }

    const user = new User({
      name,
      email,
    })
    await user.setPassword(password)
    await user.save()

    // 응답 데이터에서 password 제거
    ctx.body = user.serialize()
    
    const token = user.generateToken()
    ctx.cookies.set('access_token', token, {
      maxAge: TokenConst.DAYS_EXPIRES_IN,
      httpOnly: true
    })
  }
  catch (e) {
    ctx.throw(StatusCode.INTERNAL_ERROR, e)
  }
}

/*
 * POST /api/auth/login
 * {
 *   name: 'enttt'
 *   password: 'my-pass'
 * }
 */
const login = async ctx => {
  const { name, password } = ctx.request.body

  // username, password 가 없으면 에러 처리
  if (!name || !password) {
    ctx.status = StatusCode.INVALID_AUTH
    return
  }

  try {
    const user = await User.findByName(name)
    // 계정이 없을 경우 에러
    if (!user) {
      ctx.status = StatusCode.INVALID_AUTH
      return
    }

    const valid = await user.checkPassword(password)
    // 패스워드가 일치하지 않으면 에러
    if (!valid) {
      ctx.status = StatusCode.INVALID_AUTH
      return
    }
    ctx.body = user.serialize()

    const token = user.generateToken()
    ctx.cookies.set('access_token', token, {
      maxAge: TokenConst.DAYS_EXPIRES_IN,
      httpOnly: true
    })
  }
  catch (e) {
    ctx.throw(StatusCode.INTERNAL_ERROR, e)
  }
}

/*
 * POST /api/auth/logout
 */
const logout = async ctx => {
  ctx.cookies.set('access_token')
  ctx.status = StatusCode.EMPTY_RESPONSE
}

exports.signup = signup
exports.login = login
exports.logout = logout
