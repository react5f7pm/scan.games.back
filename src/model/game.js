const mongoose = require('mongoose')
const SaleModel = require('./sale.js')

const { Schema } = mongoose

const GameSchema = new Schema({
  name: String,
  publisher: String, // Nexon
  thumbUrl: String,
  coverUrl: String,
  sales: [ SaleModel.SaleSchema ],
  platforms: [ String ],
  description: String,
  metacritic: {
    score: Number,
    url: String,
  },
  officialPrice: Number,
  genres: [ String ],
  tags: [ String ],
  releaseDate: {
    type: Date,
    default: Date.now
  },
  createDate: {
    type: Date,
    default: Date.now, // 현재 날짜를 기본값으로 사용
  }
})

const Game = mongoose.model('Game', GameSchema, 'games')

module.exports = Game
