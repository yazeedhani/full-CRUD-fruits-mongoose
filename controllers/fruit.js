/***************** DEPENDENCIES ******************/
const express = require('express')
const Fruit = require('../models/fruit.js')

/***************** Create Router ******************/
const router = express.Router()

/***************** Router Authorization Middleware ******************/
// Before any routes hit, this middleware will check to see if the user is logged in first, then it will hit the routes if logged in
// req.session will be created by the time we get to these routes
// Now that we have user specific fruits, we'll add the username to the fruit created
router.use((req, res, next) => {
    // checking the loggedin boolean of our session
    if(req.session.loggedIn)
    {
        // if they're logged in, go to the next thing(thats the controller)
        next()
    }

    else
    {
        // if they're not logged in, then send them to the login page
        res.redirect('/user/login')
    }
})

/***************** Routes ******************/
// INDEX route -> show all the fruits
router.get('/', (req, res) => {
    // Find all the fruits in the DB by querying it
    Fruit.find({})
        // Then render a template AFTER they're found
        // fruits is what is returned if the promise is resolved/fulfilled
        .then( fruits => {
            console.log(fruits)
            // This is so we can display the currently logged in user's username
            // THhis must be done to every route that renders a view
            const username = req.session.username
			const loggedIn = req.session.loggedIn
            res.render('fruits/index.liquid', {fruits: fruits, username, loggedIn})
        })
        // Show an error if there is one
        .catch( error => {
            console.log(error)
            res.json({error})
        })
})

// INDEX route -> show only the loggedIn user's fruits
router.get('/mine', (req, res) => {
    // Find all the fruits in the DB by querying it
    Fruit.find({ owner: req.session.userId })
        // Then render a template AFTER they're found
        // fruits is what is returned if the promise is resolved/fulfilled
        .then( fruits => {
            console.log(fruits)
            const username = req.session.username
			const loggedIn = req.session.loggedIn
            res.render('fruits/index', {fruits: fruits, username, loggedIn})
        })
        // Show an error if there is one
        .catch( error => {
            console.log(error)
            res.json({error})
        })
})

/************** New and Create routes (Create new fruit) *****************/
// NEW route --> GET route that renders our page with the form
router.get('/new',(req, res) => {
    const username = req.session.username
	const loggedIn = req.session.loggedIn
    res.render('fruits/new', {username, loggedIn})
})
// CREATE route --> POST route that actually calls the DB and makes a new document
router.post('/', (req, res) => {
    // check if the readyToEat property should be true or false
    // We can check AND set this property in one line of code
    // First part sets the property name
    // Second property is a ternary operator to set the value
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
    console.log('this is the fruit to create ', req.body)
    // Now we're ready for mongoose to do it's thing
    // req.body.username = req.session.username // req.session stores the username when loggedin/ session is created
    // Instead of a username, we're now using a reference
    // and since we've stored the id of the user in the session object, we can use it tot set the owner property of the fruit upon creation
    req.body.owner = req.session.userId
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
router.get('/:id/edit', (req, res) => {
    const fruitId = req.params.id
    // We need to get the id
    // Find the fruit
    Fruit.findById(fruitId)
    // Render if there is a fruit
        .then( fruit => {
            const username = req.session.username
			const loggedIn = req.session.loggedIn
            res.render('fruits/edit', {fruit: fruit, username, loggedIn})
        })
    // Error if no fruit
        .catch( error => {
            console.log(error)
            res.json({error})
        })
})
// UPDATE/PUT route --> send a PUT request to our database
router.put('/:id', (req, res) => {
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
router.get('/:id', (req, res) => {
    // First, we need to get the id
    const fruitId = req.params.id
    // Then, we can find a fruit by its id
    Fruit.findById(fruitId)
        // Once found, then we can render a view with the data
        .then( fruit => {
            console.log('The fruit we got\n', fruit)
            const username = req.session.username
			const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            res.render('fruits/show', {fruit, username, loggedIn, userId})
        })
        // If there is an error, show that instead
        .catch( error => {
            console.log(error)
            res.json({error})
        })
})

// DELETE route
router.delete('/:id', (req, res) => {
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

/***************** Export Router ******************/
module.exports = router