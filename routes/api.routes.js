const express = require('express')
const router = express.Router()
const Works = require('../models/works.model')
const User = require('../models/user.model')

const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos para ver eso.' })


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
    Works.find({ $or: [{ title: { "$regex": name } }, { tags: { "$regex": name } }, { description: { "$regex": name } }] })
        .populate('user')
        .then(works => { res.json(works) })
        .catch(err => next(err))
})


//JSON con los usuarios
router.get('/users', checkRole(['ADMIN']), (req, res, next) => {
    User.find()
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
router.post("/users/likes", (req, res, next) => {
    const id = req.user.id
    let { likes } = req.body
    let tempLikes = [...req.user.likes, ...likes]

    User.findByIdAndUpdate(id, { likes: tempLikes })
        .then(() => console.log("likes actualizado"))
        .catch(err => next(err))
})







module.exports = router