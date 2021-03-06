const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { Schema } = mongoose
const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  createDate: {
    type: Date,
    default: Date.now,
  }
})

UserSchema.methods.setPassword = async function(passwd) {
  const hashVal = await bcrypt.hash(passwd, 10)
  this.password = hashVal
}

UserSchema.methods.checkPassword = async function(passwd) {
  const result = await bcrypt.compare(passwd, this.password)
  return result // true or false
}

UserSchema.methods.serialize = function() {
  const data = this.toJSON()
  delete data.password
  return data
}

UserSchema.methods.generateToken = function() {
  const token = jwt.sign(
    {
      _id: this.id,
      name: this.name
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  )
  return token
}

UserSchema.statics.findByName = function(name) {
  return this.findOne({ name })
}

const User = mongoose.model('User', UserSchema, 'users')
module.exports = User
