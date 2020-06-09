const mongoose = require('mongoose')
import GameSchema from '../../models/game'
const Game = mongoose.model('Game', GameSchema, 'games')

function createFakeData() {
  const games = [...Array(30).keys()].map(i => ({
    name: `Game #${i}`,
    producer: `Blizzad Partner #${i}`,
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  }))

  Game.insertMany(games, (err, docs) => {
    console.log(docs)
  })
}

exports.createFakeData = createFakeData