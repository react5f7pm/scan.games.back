const serverless = require('serverless-http')
const app = require('./index.js')

const handler = serverless(app);
module.exports.handler = async (event, context) => {
  console.log('event:' + event)
  const result = await handler(event, context);

  console.log('result:' + result)
  return result;
};
