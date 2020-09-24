const express = require('express')
const router = express.Router()
const Works = require('../models/works.model')
const Picture = require('../models/picture.model')
const User = require('../models/user.model')
const { populate } = require('../models/works.model')

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, incia sesión para continuar' })
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos para ver eso.' })

router.get('/', checkLoggedIn, (req, res) => {

    let id = req.user._id
    let cart = req.user.cart
    let products = []
    let totalPrice
    cart.forEach(element => {
        Works.findById(element)
            .then(work => {
                products.push(work)
            })
            .catch(err => next(err))
    });

    totalPrice = cart.forEach(element => {
        Works.findById(element,{price:1})
            .then(work => {
                totalPrice+=work
               
            })
            .catch(err => next(err))
    });

   
    const userPromise = User.findById(id)

    Promise.all([products, userPromise, totalPrice])
        .then(results => {
            console.log("€€€€€€€€€€€€",totalPrice)
            res.render('shop', { cart: results[0], user: results[1], totalPrice: results[2] })
        })
        .catch(err => next(err))
})





module.exports = router

