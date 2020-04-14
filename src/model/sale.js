const mongoose = require('mongoose')

const { Schema } = mongoose

const SaleSchema = new Schema({
  platform: {
    _id: mongoose.Types.ObjectId, // Steam
    name: String,
  },
  gameUuid: String, // Unique game id in platform
  price: Number,
  createDate: {
    type: Date,
    default: Date.now,
  }
})

const Sale = mongoose.model('Sale', SaleSchema, 'sales')

exports.SaleSchema = SaleSchema
exports.Sale = Sale
