const express = require('express')
const router = express.Router()

<<<<<<< HEAD
router.get('/', (req, res) => {
       res.render('index')})
=======
router.get('/', (req, res) => res.render('index'))
router.get('/shop', (req, res) => res.render('shop'))
>>>>>>> a596dc5afb0d4bf301dbccf69e3182276570ef46

module.exports = router