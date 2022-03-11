/***************** DEPENDENCIES ******************/
const mongoose = require('./connection.js')

// Here's an alternate syntax for creating a Schema
// Reminder: we do not need a model for a subdocumment.
// All we need is a Schema
// THis will be a subdocument for the fruit model
const commentSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

module.exports = commentSchema