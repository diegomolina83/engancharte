const express = require('express')
const router = express.Router()
const Works = require('../models/works.model')
const User = require('../models/user.model')

const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos para ver eso.' })
const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, incia sesión para continuar' })

// Obtiene la localizacion
router.get('/location/:id', checkRole(['ADMIN', 'USER', 'ARTIST']), (req, res, next) => {
    const id = req.params.id

    Works.findById(id)
        .then(work => res.json(work))
})

//Creamos un json con todas las obras de la bbdd
router.get('/works/', (req, res, next) => {
    Works.find()
        .populate('user')
        .then(works => { res.json(works) })
        .catch(err => next(err))
})


//JSON con todos los tags de las obras
router.get('/works/tags/', (req, res, next) => {
    Works.find()
        .populate('user')
        .then(works => { res.json(works) })
        .catch(err => next(err))
})


//JSON con las obras que contengan el tag name
router.get('/works/tags/:name', (req, res, next) => {
    name = req.params.name
    Works.find({ $or: [{ title: { "$regex": name, "$options": "i" } }, { tags: { "$regex": name, "$options": "i" } }, { description: { "$regex": name, "$options": "i" } }] })
        .populate('user')
        .then(works => { res.json(works) })
        .catch(err => next(err))
})


//JSON con los cuadros relizados por un user
router.get('/works/:userId', (req, res, next) => {
    userId = req.params.userId
    console.log("User Id del back ", userId)
    Works.find({ user: userId })
        .then(works => { res.json(works) })
        .catch(err => next(err))
})


//JSON con los usuarios
router.get('/users', checkRole(['ADMIN']), (req, res, next) => {
    User.find()
        .then(user => { res.json(user) })
        .catch(err => next(err))
})


//JSON con un usuario
router.get('/currentuser', checkLoggedIn, (req, res, next) => {
    id = req.user._id
    User.find(id)
        .then(user => { res.json(user) })
        .catch(err => next(err))

})


//JSON con los likes de los usuarios
router.get('/users/likes', checkRole(['ADMIN', 'USER', 'ARTIST']), (req, res, next) => {
    User.find({}, { likes: 1 })
        .then(likes => { res.json(likes) })
        .catch(err => next(err))

})


//Post likes
router.post("/users/likes", checkLoggedIn, (req, res, next) => {
    let { _id } = req.user
    let { likes } = req.body
    let tempLikes
    if (!req.user.likes.includes(likes)) tempLikes = [...req.user.likes, ...likes]
    else { tempLikes = req.user.likes.filter(lik => lik != likes); }

    User.findByIdAndUpdate({ _id }, { likes: tempLikes })
        .then(() => console.log("likes actualizado"))
        .catch(err => next(err))
})


//JSON con el carro de los usuarios
router.get('/users/cart', checkRole(['ADMIN', 'USER', 'ARTIST']), (req, res, next) => {
    User.find({}, { cart: 1 })
        .then(cart => { res.json(cart) })
        .catch(err => next(err))

})


//Añadir elementos a carro
router.post('/users/cart', checkLoggedIn, (req, res, next) => {
    let { _id } = req.user
    let { cart } = req.body
    let tempCart
    tempCart = [...req.user.cart, ...cart]
    User.findByIdAndUpdate({ _id }, { cart: tempCart })
        .then(() => console.log("carro actualizado"))
        .catch(err => next(err))
})


//Eliminar elementos del carro
router.post('/users/cart/delete', checkLoggedIn, (req, res, next) => {
    let { _id } = req.user
    let { cart } = req.body
    let tempCart
    tempCart = req.user.cart.filter(lik => lik != cart)
    User.findByIdAndUpdate({ _id }, { cart: tempCart })
        .then(() => console.log("carro actualizado"))
        .catch(err => next(err))
})

// // Obtener localizacion de obra
// router.get('/works/location/:id', (req, res, next) => {

//     Works.findById(req.params.id, { location })
//         .then(response => res.json(response))
//         .catch(err => console.log(err))

// })

module.exports = router