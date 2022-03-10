/***************** DEPENDENCIES ******************/
const express = require('express')

/***************** Create a Router ******************/
const router = express.Router()

/***************** Routes ******************/
router.get('/', (req, res) => {
    res.render('index')
})

/***************** Export Router ******************/
module.exports = router