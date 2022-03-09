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

app.get('/fruits/seed', (req, res) => {
    //array of starter fruits
    const startFruits = [
        { name: "Orange", color: "orange", readyToEat: false },
        { name: "Grape", color: "purple", readyToEat: false },
        { name: "Banana", color: "orange", readyToEat: false },
        { name: "Strawberry", color: "red", readyToEat: false },
        { name: "Coconut", color: "brown", readyToEat: false },
      ]
      // when we seed data, there are a few steps invlolved
      // delete all the data that already exists (will only happen if data exists)
      Fruit.remove({})
        .then( data => {
            console.log('this is what remove returns', data)
            // then we can create with our seed data
            Fruit.create(startFruits)
                .then( data => {
                    console.log('this is what create returns', data)
                    // then we can send if we want to see that data
                    res.send(data)
                })
        })
})

// INDEX route
app.get('/fruits', (req, res) => {
    // Find all the fruits in the DB by querying it
    Fruit.find({})
        // Then render a template AFTER they're found
        // fruits is what is returned if the promise is resolved/fulfilled
        .then( fruits => {
            console.log(fruits)
            res.render('fruits/index.liquid', {fruits: fruits})
        })
        // Show an error if there is one
        .catch( error => {
            console.log(error)
            res.json({error})
        })
})

/************** New and Create routes (Create new fruit) *****************/
// NEW route --> GET route that renders our page with the form
app.get('/fruits/new',(req, res) => {
    res.render('fruits/new')
})

// CREATE route --> POST route that actually calls the DB and makes a new document
app.post('/fruits', (req, res) => {
    // check if the readyToEat property should be true or false
    // We can check AND set this property in one line of code
    // First part sets the property name
    // Second property is a ternary operator to set the value
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
    console.log('this is the fruit to create ', req.body)
    // Now we're ready for mongoose to do it's thing
    Fruit.create(req.body)
        .then( fruit => {
            console.log('this was returned from create: ', fruit)
            res.redirect('/fruits')
        })
        .catch( error => {
            console.log(error)
            res.json({error})
        })
})
/******************************************************/

/************** Edit and Update routes (update fruit) *****************/
// EDIT route --> a GET that takes us to the edit form view
app.get('/fruits/:id/edit', (req, res) => {
    const fruitId = req.params.id
    // We need to get the id
    // Find the fruit
    Fruit.findById(fruitId)
    // Render if there is a fruit
        .then( fruit => {
            res.render('fruits/edit', {fruit: fruit})
        })
    // Error if no fruit
        .catch( error => {
            console.log(error)
            res.json({error})
        })
})

// UPDATE/PUT route --> send a PUT request to our database
app.put('/fruits/:id', (req, res) => {
    // get the id
    const fruitId = req.params.id
    // check and assign the readyToEat property with the correct value
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
    // tell mongoose to update the fruit
    Fruit.findByIdAndUpdate(fruitId, req.body, {new: true})
        // if successful -> redirect to the fruit page
        .then( fruit => {
            console.log('The update fruit, ', fruit)
            res.redirect(`/fruits/${fruit.id}`)
        })
        // if an error, display that
        .catch( error => {
            console.log(error)
            res.json({error})
        })
})

/******************************************************/

// SHOW route
app.get('/fruits/:id', (req, res) => {
    // First, we need to get the id
    const fruitId = req.params.id
    // Then, we can find a fruit by its id
    Fruit.findById(fruitId)
        // Once found, then we can render a view with the data
        .then( fruit => {
            res.render('fruits/show', {fruit})
        })
        // If there is an error, show that instead
        .catch( error => {
            console.log(error)
            res.json({error})
        })
})

// DELETE route
app.delete('/fruits/:id', (req, res) => {
    // Get the fruit id
    const fruitId = req.params.id
    // Delete the fruit
    Fruit.findByIdAndRemove(fruitId)
        .then( fruit => {
            console.log('this is the response from FBID ', fruit)
            res.redirect('/fruits')
        })
        .catch( error => {
            console.log(error)
            res.json({error})
        })

})

/***************** Server Listener ******************/
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('App is listening on port: ', PORT)
})