const express = require('express')
const Works = require('../models/works.model')
const router = express.Router()

router.get('/', (req, res) => {
    Works.find({})
    .populate('user')
    .then(works=>{
        
        res.render('index',{works})})
    .catch(err=>console.log('Error: ', err))
})
router.get('/shop', (req, res) => res.render('shop'))

module.exports = router