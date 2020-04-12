// import Joi from 'joi'
// import StatusCode from '../../const/httpStatusCode.js'

/*
 * GET  /api/system/liveCheck
 */
export const liveCheck = async ctx => {
  const timeArrived = Date.now()
  ctx.body = 'Live Check:' + timeArrived
  return
}

export default {
  liveCheck
}