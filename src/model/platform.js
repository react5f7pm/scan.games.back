const mongoose = require('mongoose')

const { Schema } = mongoose

const PlatformSchema = new Schema({
  name: String,
  homePage: String,
  description: String,
  createDate: {
    type: Date,
    default: Date.now
  }
})

const Platform = mongoose.model('Platform', PlatformSchema, 'platforms')
module.exports = Platform
