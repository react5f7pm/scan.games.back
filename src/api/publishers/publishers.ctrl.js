import mongoose from 'mongoose'
import Joi from 'joi'

import StatusCode from '../../const/httpStatusCode.js'
import Publisher from '../../model/publisher.js'

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
 * POST /api/publishers
 * { 
 *   name: '이름',
 *   description: '설명'
 * }
 */
export const create = async ctx => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있는지 검증
    name: Joi.string().required(),
    description: Joi.string().required(),
  })

  // 검증 결과가 실패일 경우 오류 리턴
  const result = Joi.validate(ctx.request.body, schema)
  if (result.error) {
    ctx.status = StatusCode.INVALID_PARAMS
    ctx.body = result.error
    return
  }

  const { name, description } = ctx.request.body
  const publisher = new Publisher({
    name,
    description,
  })
  try {
    await publisher.save()
    ctx.body = publisher
  }
  catch (e) {
    ctx.throw(StatusCode.INTERNAL_ERROR, e)
  }
}

/*
 * GET /api/publishers
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
    const publishers = await Publisher.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean() // 데이타를 MongoDB 문서 인스턴스가 아닌 JSON 형태로 조회
      .exec()

    const publisherCount = await Publisher.countDocuments(query).exec()
    ctx.set('Last-Page', Math.ceil(publisherCount / 10))
    ctx.body = publishers
      // .map(publisher => publisher.toJSON())
      .map(publisher => ({
        ...publisher,
        description: (publisher.description.length < 200) ? publisher.description : `${publisher.description.slice(0,200)}...`
      }))
  }
  catch (e) {
    ctx.throw(StatusCode.INTERNAL_ERROR, e)
  }
}

export default {
  checkObjectId, create, list,
}