const express = require('express')
const Works = require('../models/works.model')
const router = require("./index.routes")

router.get('/maps', (req, res) => {
    const {location} = req.body
    res.render('apiHere', {location})
})
router.post('/maps', (req, res) => {
    const {location} = req.body
  //  const price = 100000
  //  const title = "ejemplo22"
    //Works.create({location, price, title}).then(res => console.log(res))
    varDB = Works.find({location}).then(location => 
        res.render('apiHere', location)
        )

   res.redirect('/maps')
    
    console.log(site)
})


module.exports = router