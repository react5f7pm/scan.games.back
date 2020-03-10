import mongoose from 'mongoose'
import Joi from 'joi'

import StatusCode from '../../const/httpStatusCode.js'
import Game from '../../model/game.js'

const { ObjectId } = mongoose.Types

export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params
  if (!ObjectId.isValid(id)) {
    ctx.status = StatusCode.INVALID_PARAMS
    return
  }
  return next()
}

/* 
 * POST /api/games
 * { 
 *   name: '이름',
 * }
 */
export const create = async ctx => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있는지 검증
    name: Joi.string().required(),
  })

  // 검증 결과가 실패일 경우 오류 리턴
  const result = Joi.validate(ctx.request.body, schema)
  if (result.error) {
    ctx.status = StatusCode.INVALID_PARAMS
    ctx.body = result.error
    return
  }

  const { name } = ctx.request.body
  const game = new Game({
    name,
  })
  try {
    await game.save()
    ctx.body = game
  }
  catch (e) {
    ctx.throw(StatusCode.INTERNAL_ERROR, e)
  }
}

/*
 * GET /api/games
 */
export const list = async ctx => {
  // query 는 문자열이므로 숫자로 변환
  const page = parseInt(ctx.query.page || '1', 10)
  if (page < 1) {
    ctx.status = StatusCode.INVALID_PARAMS
    return
  }

  const { name } = ctx.query
  // name 이 쿼리 파라미터로 넘어왔을 경우 해당 조건으로 검색 (TODO 패턴 검색)
  const query = {
    ...(name ? { 'game.name': name } : {}),
  }

  try {
    const games = await Game.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean() // 데이타를 MongoDB 문서 인스턴스가 아닌 JSON 형태로 조회
      .exec()

    const gameCount = await Game.countDocuments(query).exec()
    ctx.set('Last-Page', Math.ceil(gameCount / 10))
    ctx.body = games
      // .map(game => game.toJSON())
      .map(game => ({
        ...game,
        description: (game.description.length < 200) ? game.description : `${game.description.slice(0,200)}...`
      }))
  }
  catch (e) {
    ctx.throw(StatusCode.INTERNAL_ERROR, e)
  }
}

/*
 * GET /api/games/:id
 */
export const read = async ctx => {
  // TODO
}

/*
 * DELETE /api/games/:id
 */
export const remove = async ctx => {
  const { id } = ctx.params
  try {
    await Game.findByIdAndDelete(id).exec()
    ctx.status = StatusCode.EMPTY_RESPONSE
  }
  catch (e) {
    ctx.throw(StatusCode.INTERNAL_ERROR, e)
  }
}

/* 
 * PATCH /api/games/:id
 * {
 *   name: '수정',
 * }
 */
export const update = async ctx => {
  // TODO 
}

export default {
  checkObjectId, create, list, read, remove, update
}