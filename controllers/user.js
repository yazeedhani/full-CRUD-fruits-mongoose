/***************** DEPENDENCIES ******************/
const express = require('express')
const User = require('../models/user.js')
const bcrypt = require('bcryptjs')

/***************** Create Router ******************/
const router = express.Router()

/***************** Routes ******************/
// Two sign up routes
// GET to render the Signup form
router.get('/signup', (req, res) => {
    res.send('sign up page')
})
// POST to send the signup info
router.post('signup', (req, res) => {
    res.send('singup -> post')
})

// Two login routes
// GET to render the login form
router.get('/login', (req, res) => {
    res.send('login page')
})
// POST to sens the login info(and create a session)
router.post('/login', (req, res) => {
    res.send('login -> post')
})

// Signout route  --> to destroy the session

/***************** Export Router ******************/
module.exports = router