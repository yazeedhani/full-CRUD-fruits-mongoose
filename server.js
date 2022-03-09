/***************** DEPENDENCIES ******************/
//Allows us to load our env variables
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
// we'll also import our fruit model when we have it
const Fruit = require('./models/fruit.js')

/***************** Create our Express Application Object ******************/
const app = require('liquid-express-views')(express())


/***************** Middleware ******************/
// THis is for request logging
app.use(morgan('tiny'))
app.use(methodOverride('_method'))
// Parses urlencoded request bodies
app.use(express.urlencoded({extended: false}))
// To server files from public statically
app.use(express.static('public'))


/***************** Routes ******************/
app.get('/', (req, res) => {
    console.log(Fruit)
    res.send('Your server is running, better go catch it.')
})

/***************** Server Listener ******************/
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('App is listening on port: ', PORT)
})