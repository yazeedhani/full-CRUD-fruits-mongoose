/***************** DEPENDENCIES ******************/
require('dotenv').config()
const mongoose = require('mongoose')

/***************** Database Connection ******************/
// Here, we are setting up inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// Establish connection to our local DB
mongoose.connect(DATABASE_URL, CONFIG)

// Events for when our connection opens/closes for errors
mongoose.connection
    .on("error", (err) => console.log(err.message + " is mongod not running?"))
    .on("open", () => console.log("mongo connected: ", mongoURI))
    .on("close", () => console.log("mongo disconnected"))

/***************** Export our Connection ******************/
module.exports = mongoose