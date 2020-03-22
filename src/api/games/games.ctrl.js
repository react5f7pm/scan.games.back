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
 *   name: 'Diablo III',
 *   genre: 'Hack & Slash'
 *   developer: 'Blizzad Entertainment',
 *   producer: 'Activision Blizzad',
 *   thumbUrl: 'https://images.blizzard.com/diablo3/artworks/cd.png',
 *   coverUrl: 'https:/images.blizzard.com/diablo3/artworks/cover.png',
 *   sales: [Sale],
 *   os: ['Window', 'MacOS'],
 *   description: '설명',
 *   metacritic: { score: 10, url: '' },
 *   tags: [ 'Action RPG' ],
 *   releaseDate: ''
 * }
 */
export const create = async ctx => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있는지 검증
    name: Joi.string().required(),
    genre: Joi.string(),
    developer: Joi.string().required(),
    producer: Joi.string(),
    thumbUrl: Joi.string(),
    coverUrl: Joi.string(),
    os: Joi.array().items(Joi.string()).required(),
    description: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    releaseDate: Joi.date().required()
  })

  // 검증 결과가 실패일 경우 오류 리턴
  const result = Joi.validate(ctx.request.body, schema)
  if (result.error) {
    ctx.status = StatusCode.INVALID_PARAMS
    ctx.body = result.error
    return
  }

  const { 
    name,
    genre,
    developer,
    producer, 
    thumbUrl, 
    coverUrl, 
    os, 
    description, 
    tags,
    releaseDate
  } = ctx.request.body
  const game = new Game({
    name,
    genre,
    developer,
    producer,
    thumbUrl,
    coverUrl,
    os,
    description,
    tags,
    releaseDate
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
 * GET /api/games/search?name=abc
 */
export const search = async ctx => {
  // TODO
}

/*
 * GET /api/games/:id
 */
export const read = async ctx => {
  const { id } = ctx.params
  try {
    const game = await Game.findById(id).exec()
    if (!game) {
      ctx.status = StatusCode.NOT_FOUND
      return
    }
    ctx.body = game
  }
  catch (e) {
    ctx.throw(StatusCode.INTERNAL_ERROR, e)
  }
}

/* 
 * PATCH /api/games/:id
 * {
 *   metacritic: {
 *    score: 80,
 *    url: 'http://www.sales.com'
 *   },
 * }
 */
export const update = async ctx => {
  const { id } = ctx.params

  const metacritic = Joi.object().keys({
    score: Joi.number().required(),
    url: Joi.string().required()
  })
  const schema = Joi.object().keys({
    metacritic: Joi.object(metacritic)
  })

  const result = Joi.validate(ctx.request.body, schema)
  if (result.error) {
    ctx.status = StatusCode.INVALID_PARAMS,
    ctx.body = result.error
    return
  }

  try {
    const game = await Game.findByIdAndUpdate(id, ctx.request.body, {
      new: true
    }).exec()
    if (!game) {
      ctx.status = StatusCode.NOT_FOUND
      return
    }
    ctx.body = game
  }
  catch (e) {
    ctx.throw(StatusCode.INTERNAL_ERROR, e)
  }
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

export default {
  checkObjectId, 
  create, 
  list, 
  search, 
  read, 
  update, 
  remove
}