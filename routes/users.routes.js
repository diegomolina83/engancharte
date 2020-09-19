const express = require('express')
const User = require('../models/user.model')
const router = express.Router()

router.get('/users', (req, res) => {

User.find()
.then(users=>res.render('users/profile',{users}))
.catch(err=>console.log('Error: ', err))

})




module.exports = router