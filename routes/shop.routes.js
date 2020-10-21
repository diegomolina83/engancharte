const express = require('express')
const router = express.Router()
const Works = require('../models/works.model')
const Picture = require('../models/picture.model')
const User = require('../models/user.model')
const { populate } = require('../models/works.model')

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, incia sesión para continuar' })
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos para ver eso.' })


//Pintar la tienda
router.get('/', checkLoggedIn, (req, res) => {
    let id = req.user._id
    let cart = req.user.cart
    let products = []
    let totalPrice = 0
    cart.forEach(element => {
        Works.findById(element)
            .then(work => {
                products.push(work)
                totalPrice += work.price
            })
            .catch(err => next(err))
    })
    const userPromise = User.findById(id)
    Promise.all([products, userPromise])
        .then(results => {

            res.render('shop', { cart: results[0], user: results[1], totalPrice })
        })
        .catch(err => next(err))
})


//Borrar obras del carro
router.get('/:id/delete', checkLoggedIn, (req, res, next) => {
    let deleteWork = req.user.cart
    if (deleteWork.includes(req.params.id)) {
        let index = deleteWork.indexOf(req.params.id)
        deleteWork.splice(index, 1)
        User.findByIdAndUpdate(req.user.id, { cart: deleteWork })
            .then(() => res.redirect('back'))
            .catch(err => next(err))
    }
})


module.exports = router

