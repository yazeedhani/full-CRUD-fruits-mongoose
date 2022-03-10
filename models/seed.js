/***************** DEPENDENCIES ******************/
const mongoose = require('./connection.js')
const Fruit = require('../models/fruit.js')

/***************** Seed Code ******************/
// Save the connection in a variable
const db = mongoose.connection

// SEED route to add seed data to our database
// Make sure code is not run until connected to DB
// on an open connection to the DB, add the seed data to our DB
db.on('open', () => {
    //array of starter fruits
    // Run any database queries in this function
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
        .then( deletedFruits => {
            console.log('this is what remove returns', deletedFruits)
            // then we can create with our seed data
            Fruit.create(startFruits)
                .then( data => {
                    // then we can send if we want to see that data
                    console.log('Here are the new seed fruits', data)
                    //close db after data is seeded in DB
                    db.close()
                })
                .catch( error => {
                    console.log(error)
                    db.close()
                })
        })
        .catch( error => {
            console.log(error)
            db.close()
        })
})