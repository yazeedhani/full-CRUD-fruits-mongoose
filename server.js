/***************** DEPENDENCIES ******************/
//Allows us to load our env variables
require('dotenv').config()
const express = require('express')
// we'll also import our fruit model when we have it
// We no longer need this reference because it lives in the fruit controller now
// const Fruit = require('./models/fruit.js')
// Now that we're using controllers as they should be used,
// We need to acquire our routers
const FruitRouter = require('./controllers/fruit.js')
const UserRouter = require('./controllers/user.js')
const HomeRouter = require('./controllers/home.js')
const CommentRouter = require('./controllers/comment.js')
/***************** Create our Express Application Object ******************/
const app = require('liquid-express-views')(express())

/***************** Middleware ******************/
const middleware = require('./utils/middleware.js')
middleware(app)


/***************** Routes ******************/
// Register our routes here
// Any routes that begin with /fruits, send them to the FruitRouter
// Will prepend /fruits to all the routes in our fruits controller file
app.use('/fruits', FruitRouter)
app.use('/comments', CommentRouter)
app.use('/user', UserRouter)
app.use('/', HomeRouter)

// Old home. Now were using HomeRouter
// app.get('/', (req, res) => {
//     // console.log(Fruit)
//     res.send('Your server is running, better go catch it.')
// })

/***************** Server Listener ******************/
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('App is listening on port: ', PORT)
})