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
    res.render('users/signup')
})
// POST to send the signup info
router.post('/signup', async (req, res) => {
    // res.send('singup -> post')
    console.log('This is initial req.body in signup ', req.body)
    // first encrypt our password (this takes a while so this is why we use async/await)
    req.body.password = await bcrypt.hash(
        req.body.password,
        await bcrypt.genSalt(10)
    )
    console.log('This is req.body after hash ', req.body)
    // create a new user
    User.create(req.body)
    // if created successfully, redirect to login page
        .then( user => {
            res.redirect('/user/login')
        })
    // if an error occurs, send the error
        .catch(error => {
            console.log(error)
            res.json({error})
        })
})

// Two login routes
// GET to render the login form
router.get('/login', (req, res) => {
    res.render('users/login')
})
// POST to sens the login info(and create a session)
router.post('/login', async (req, res) => {
    // res.send('login -> post')
    // get the data from the request body
    const {username, password} = req.body
    // then we search for the user
    User.findOne({username})
        .then( async (user) => {
            // check if user exists
            if(user)
            {
                // compare the password
                // bcrypt.compare evaluates to a truthy or falsy value
                const result = await bcrypt.compare(password, user.password)

                if(result)
                {
                    // then we'll need to use the session object
                    // store some properties in the session
                    req.session.username = username
                    req.session.loggedIn = true
                    // redirect to /fruits if login is successful
                    res.redirect('/fruits')
                }
                else
                {
                    // send an error if password is wrong
                    res.json({error: 'username or password incorrect'})
                }
            }
            else
            {
                // send an error if user doesn't exist
                res.json({error: 'user does not exist'})
            }
        })
        // catch any other errors that occur
        .catch( error => {
            console.log(error)
            res.json({error})
        })
})

// Signout route  --> to destroy the session

/***************** Export Router ******************/
module.exports = router