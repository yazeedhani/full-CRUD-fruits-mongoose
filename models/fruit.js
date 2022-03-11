/***************** DEPENDENCIES ******************/
const mongoose = require('./connection.js')

// we also need to import our commentSchema
const commentSchema = require('./comment.js')

// We'll import our user model so we can populate the info
const User = require('./user.js')

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
        // Instead of username, we're going to use a reference
        // username: {type: String}
        owner: {
            // References the type 'objectid'
            type: Schema.Types.ObjectId,
            // References the Model 'User'
            ref: 'User'
            // Now that we have an owner field, let's look and
            // replace references to the username in our fruit controllers
        },
        comments: [commentSchema]
    }, {timestamps: true}
)

// Make our fruit model that will use the Schema
const Fruit = model('Fruit', fruitSchema)

/***************** Export our Model ******************/
module.exports = Fruit