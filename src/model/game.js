import mongoose from 'mongoose'

const { Schema } = mongoose

const GameSchema = new Schema({
  name: String,
  producer: String, // Nexon
  thumbUrl: String,
  coverUrl: String,
  prices: [
    {
      publisher: {
        _id: mongoose.Types.ObjectId, // Steam
        name: String,
      },
      identifier: String,
      price: Number,
      discountPrice: Number,
      dateCreated: Date,
    }
  ],
  description: String,
  metacritic: {
    score: Number,
    url: String,
  },
  tags: [String],
  dateCreated: {
    type: Date,
    default: Date.now, // 현재 날짜를 기본값으로 사용
  }
})

const Game = mongoose.model('Game', GameSchema)
export default Game
