/***************** DEPENDENCIES ******************/
const mongoose = require('./connection.js')

/***************** Define our Fruits Model ******************/
// Pull the Schema and Model constructors from mongoose
// We're going to use something called destructuring to accomplish this
const { Schema, model } = mongoose

// Make our fruits Schema
const fruitSchema = new Schema(
    {
        name: {type: String},
        color: {type: String},
        readyToEat: {type: Boolean},
        username: {type: String}
    }, {timestamps: true}
)

// Make our fruit model that will use the Schema
const Fruit = model('Fruit', fruitSchema)

/***************** Export our Model ******************/
module.exports = Fruit