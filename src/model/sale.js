import mongoose from 'mongoose'

const { Schema } = mongoose

export const SaleSchema = new Schema({
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

export const Sale = mongoose.model('Sale', SaleSchema, 'sales')

export default { 
  SaleSchema, 
  Sale 
}