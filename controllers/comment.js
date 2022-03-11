/***************** DEPENDENCIES ******************/
const express = require('express')
const mongoose = require('mongoose')
// We need our Fruit model because comments are ONLY a schema
// So we'll run querires on fruits, and add in comments
const Fruit = require('../models/fruit.js')
const { route } = require('./user.js')


/***************** Create Router ******************/
const router = express.Router()


/*****************  Routes ******************/
// Only need two routes for comments right now
// POST -> to create a comment
router.post('/:fruitId', (req, res) => {
    const fruitId = req.params.fruitId
    console.log('First comment body', req.body)
    // we'll adjust req.body to include an author
    // The author's id will be the logged-in user's id
    req.body.author = req.session.userId
    console.log('Updated comment body', req.body)
    // We'll find the fruit with the fruitID
    Fruit.findById(fruitId)
        .then( fruit => {
            // Then we'll send req.body to the comments array
            fruit.comments.push(req.body)
            // Save the fruit
            return fruit.save()
        })
        .then( fruit => {
            // redirect
            res.redirect(`/fruits/${fruit.id}`)
        })
        .catch( error => {
            // or how an error if we have one
            console.log(error)
            res.json({error})
        })
})

// DELETE -> to destroy a comment

/***************** Export Router ******************/
module.exports = router