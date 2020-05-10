const mongoose = require('mongoose')

const { Schema } = mongoose

const SaleSchema = new Schema({
  platform: String,
  game: {
    type: mongoose.Types.ObjectId,
    ref: 'Game',
  },
  gameUuid: String,
  price: Number,
  createDate: {
    type: Date,
    default: Date.now,
  }
})

const Sale = mongoose.model('Sale', SaleSchema, 'sales')

exports.SaleSchema = SaleSchema
exports.Sale = Sale
