import mongoose from 'mongoose'

const { Schema } = mongoose

const PublisherSchema = new Schema({
  name: String,
  homePage: String,
  description: String,
  dateCreated: {
    type: Date,
    default: Date.now
  }
})

const Publisher = mongoose.model('Publisher', PublisherSchema)
export default Publisher
