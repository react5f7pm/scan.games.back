import mongoose from 'mongoose'
import Joi from './joi'

import StatusCode from '../../const/httpStatusCode.js'
import Platform from '../../model/platform.js'

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
 * POST /api/platforms
 * { 
 *   name: '이름',
 *   homePage: 'http://www.com',
 *   description: '설명'
 * }
 */
export const create = async ctx => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있는지 검증
    name: Joi.string().required(),
    homePage: Joi.string().required(),
    description: Joi.string(),
  })

  // 검증 결과가 실패일 경우 오류 리턴
  const result = Joi.validate(ctx.request.body, schema)
  if (result.error) {
    ctx.status = StatusCode.INVALID_PARAMS
    ctx.body = result.error
    return
  }

  const { name, homePage, description } = ctx.request.body
  const platform = new Platform({
    name,
    homePage,
    description,
  })
  try {
    await platform.save()
    ctx.body = platform
  }
  catch (e) {
    ctx.throw(StatusCode.INTERNAL_ERROR, e)
  }
}

/*
 * GET /api/platforms
 */
export const list = async ctx => {
  // query 는 문자열이므로 숫자로 변환
  const page = parseInt(ctx.query.page || '1', 10)
  if (page < 1) {
    ctx.status = StatusCode.INVALID_PARAMS
    return
  }

  const { name } = ctx.query
  // name 이 쿼리 파라미터로 넘어왔을 경우 해당 조건으로 검색
  const query = {
    ...(name ? { 'user.name': name } : {}),
  }

  try {
    const platforms = await Platform.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean() // 데이타를 MongoDB 문서 인스턴스가 아닌 JSON 형태로 조회
      .exec()

    const platformCount = await Platform.countDocuments(query).exec()
    ctx.set('Last-Page', Math.ceil(platformCount / 10))
    ctx.body = platforms
      // .map(platform => platform.toJSON())
      .map(platform => ({
        ...platform,
        description: (platform.description.length < 200) ? platform.description : `${platform.description.slice(0,200)}...`
      }))
  }
  catch (e) {
    ctx.throw(StatusCode.INTERNAL_ERROR, e)
  }
}

export default {
  checkObjectId, 
  create, 
  list,
}