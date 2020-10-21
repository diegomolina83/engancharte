const express = require('express')
const router = express.Router()
const Works = require('../models/works.model')
const Picture = require('../models/picture.model')
const User = require('../models/user.model')
const cdnUploader = require('../configs/cloudinary.config')
const { route } = require('./index.routes')

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, incia sesión para continuar' })
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos para ver eso.' })


// Muestra todas las obras de la bbdd
router.get('/', checkRole(['ADMIN', 'ARTIST', 'USER']), (req, res, next) => {
    Works.find()
        .then(works => { res.render('works/indexWorks', { works }) })
        .catch(err => next(err))
})


// Crea una obra en la bdd (GET)
router.get('/create', checkRole(['ADMIN', 'ARTIST']), (req, res, next) => {
    if (req.user.role === 'USER') {
        res.render("/works", { errorMsg: "Debes ser artista" })
        return
    }
    res.render("works/createWorks")
})


// Crea una obra en la bdd (POST)
router.post('/create', cdnUploader.single('imageInput'), (req, res, next) => {
    const { title, description, tags, price, location } = req.body
    const tematica = tags.split(',')
    if (!title || !description || !price) {
        res.render("works/createWorks", { errorMsg: "Rellena los campos titulo, descripcion y precio" })
        return
    }
    if (req.file) {
        if (req.file.size > 2000000) {
            res.render("auth/signup", { errorMsg: "El tamaño de la imagen no puede ser superior a 2 MB" })
            return
        }
        Picture.create({
            name: req.file.originalname,
            path: req.file.path,
            originalName: req.file.originalname
        })
            .then(() => console.log("imagen creada"))
            .catch(err => next(err))

        imageUrl = req.file.path
    } else {
        imageUrl = '../images/defecto.png'
    }
    Works.create({ title, description, tags: tematica, imageUrl, price, user: req.user, location })
        .then(res.redirect('/'))
        .catch(err => next(err))
})


// Muestra los detalles de cada obra
router.get('/details/:id', checkRole(['ADMIN', 'USER', 'ARTIST']), (req, res, next) => {
    const id = req.params.id

    Works.findByIdAndUpdate(id)
        .populate('user')
        .then(work => res.render('works/detailsWorks', { work }))
        .catch(err => next(err))
})

// Muestra las obras del artista logueado
router.get('/my-works', checkRole(['ADMIN', 'USER', 'ARTIST']), (req, res, next) => {
    let myWorks = []
    Works.find()
        .populate('user')
        .then(worksUser => {
            worksUser.forEach(element => {
                if (element.user.id == req.user.id) {
                    myWorks.push(element)
                }
            })
            res.render('works/viewMyWorks', { myWorks })
        })
        .catch(err => next(err))
})


// Borrar obra
router.get('/:id/delete', (req, res, next) => {
    const id = req.params.id
    Works.findByIdAndDelete(id)
        .then(deleteWork => res.redirect('back'))
        .catch(err => next(err))
})


// editar obra (GET)
router.get('/:id/edit', (req, res, next) => {
    const id = req.params.id
    Works.findByIdAndUpdate(id)
        .then(work => res.render('works/editWorks', work))
        .catch(err => next(err))
})


// editar obra (POST)
router.post('/:id/edit', checkLoggedIn, (req, res, next) => {
    const id = req.params.id
    const { title, description, tags, price } = req.body
    Works.findByIdAndUpdate(id, { title, description, tags, price })
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})


//Eliminar obras de me gusta
router.get('/unfollow/:id', checkLoggedIn, (req, res, next) => {
    let tempLikes = req.user.likes
    if (tempLikes.includes(req.params.id)) {
        let index = tempLikes.indexOf(req.params.id)
        tempLikes.splice(index, 1)
        User.findByIdAndUpdate(req.user.id, { likes: tempLikes })
            .then(() => res.redirect('back'))
            .catch(err => next(err))
    } else { console.log("no lo seguías") }
})


//Seguir Obras
router.get('/follow/:id', checkLoggedIn, (req, res, next) => {
    newFollow = req.user.likes   //El array se llena con los usuarios a los que sigue el user
    if (!req.user.likes.includes(req.params.id)) {
        newFollow.push(req.params.id)
        User.findByIdAndUpdate(req.user.id, { likes: newFollow })
            .then(() => res.redirect('back'))
            .catch(err => next(err))
    }
    else console.log("YA ESTÁ INCLUIDO")
})

module.exports = router


