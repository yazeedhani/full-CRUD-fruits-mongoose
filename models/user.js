/***************** DEPENDENCIES ******************/
const mongoose = require('./connection.js')

/***************** Define our User Model ******************/
// Pull the Schema and Model constructors from mongoose
// We're going to use something called destructuring to accomplish this
const { Schema, model } = mongoose

// Make a user Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// Make a user model
// Mongo will automatically create a collection named 'users'
const User = model('User', userSchema)

/***************** Export our User Model ******************/
module.exports = User