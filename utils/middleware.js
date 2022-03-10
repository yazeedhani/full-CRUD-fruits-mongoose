/***************** DEPENDENCIES ******************/
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const FruitRouter = require('../controllers/fruit')
const UserRouter = require('../controllers/user')
// Session middleware requirements
const session = require('express-session')
const MongoStore = require('connect-mongo')

/***************** Middleware Function ******************/
const middleware = (app) => {
    // THis is for request logging
    app.use(morgan('tiny'))
    app.use(methodOverride('_method'))
    // Parses urlencoded request bodies
    app.use(express.urlencoded({extended: false}))
    // To server files from public statically
    app.use(express.static('public'))
    // this is the middleware to set up a session
    app.use(
        session({
            secret: process.env.SECRET,
            store: MongoStore.create({mongoUrl: process.env.DATABASE_URL}), // this creates a collection in our DB called sessions that will store our session data
            saveUnitialized: true,
            resave: false
        })
    )
}

/***************** Export our Middleware Function ******************/
module.exports = middleware