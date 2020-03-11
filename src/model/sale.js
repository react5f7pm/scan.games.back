import mongoose from 'mongoose'

const { Schema } = mongoose

export const SaleSchema = new Schema({
  publisher: {
    _id: mongoose.Types.ObjectId, // Steam
    name: String,
  },
  isbn: String,
  price: Number,
  dateCreated: {
    type: Date,
    default: Date.now,
  }
})

export const Sale = mongoose.model('Sale', SaleSchema)

export default { 
  SaleSchema, 
  Sale 
}