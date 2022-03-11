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
// We'll use two params to make our life easier
// first the id of the fruit, since we need to find it
// then the id of the comment, since we want to delte it
router.delete('/delete/:fruitId/:commId', (req, res) => {
    // first we want to parse out our IDs
    const fruitId = req.params.fruitId
    const commId = req.params.commId
    // then we'll find the fruit
    Fruit.findById(fruitId)
    .then( fruit => {
        // .id() is a subdocument method used to get the id of a subdocument
        const theComment = fruit.comments.id(commId)
        // Only delete the comment if the user who is logged in is the commet's author
        if( theComment.author == req.session.userId)
        {
            // then we'll delete the comment
            theComment.remove()
            // return save the fruit
            return fruit.save()
        }
        else
        {
            return
        }
    })
    .then( fruit => {
        // redirect to the fruit show page
        res.redirect(`/fruits/${fruitId}`)
    })
    .catch(error => {
        // catch any errors
        console.log(error)
        res.json(error)
    })
})

/***************** Export Router ******************/
module.exports = router