const express = require('express')
const router = express.Router()
const Works = require('../models/works.model')
const Picture = require('../models/picture.model')
const User = require('../models/user.model')
const cdnUploader = require('../configs/cloudinary.config')
const { route } = require('./index.routes')

const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos para ver eso.' })

// Musetra todas las obras de la bbdd
router.get('/', checkRole(['ADMIN', 'ARTIST', 'USER']), (req, res, next) => {

        Works.find({}).then(works => { res.render('works/indexWorks', {works})})    
})

// Crea una obra en la bdd
router.get('/create', checkRole(['ADMIN', 'ARTIST']),(req, res, next) => { 
    if (req.user.role === 'USER') {
        res.render("/works", {errorMsg: "Debes ser artista"})
        return
    }
    res.render("works/createWorks")})

router.post('/create', cdnUploader.single('imageInput'),(req, res, next) => { 
    const {title, description, tematica,author, price} = req.body
    const idUser = req.user.id

    if (!title || !description || !price) {
        res.render("works/createWorks", { errorMsg: "Rellena los campos titulo, descripcion y precio" })
        return
    }

    if (req.file) {

        if(req.file.size>2000000){
            res.render("auth/signup", { errorMsg: "El tamaño de la imagen no puede ser superior a 2 MB" })
            return
        } 

        Picture.create({
            name:req.file.originalname,
            path:req.file.path,
            originalName: req.file.originalname
            })
            imageUrl= req.file.path
      } else {
          imageUrl='../images/defecto.png'
      }

    Works.create({title, description, tematica, imageUrl, author, price, user:req.user})
    .then(res.redirect('/'))
})



// Muestra los detalles de cada obra
router.get('/details/:id', checkRole(['ADMIN', 'USER', 'ARTIST']), (req, res, next) => {

    const id = req.params.id
    Works.findByIdAndUpdate(id)
    .populate('user')
    .then(work => res.render('works/detailsWorks', {work}))
})



// Muestra las obras del artista loggeado
router.get('/my-works', checkRole(['ADMIN', 'USER', 'ARTIST']), (req, res, next) => {

    Works.find({idUser: req.user.id}).then(worksUser => res.render('works/viewMyWorks', {worksUser}))
    .catch(err => console.log(err))
})


// Borrar obra
router.get('/:id/delete', (req, res) => {

    const id = req.params.id
    Works.findByIdAndDelete(id).then(deleteWork => res.redirect('/works'))
        .catch(err => console.log(err))
})


// editar obra
router.get('/:id/edit', (req, res) => {
    
    const id = req.params.id
    console.log(id)

    Works.findByIdAndUpdate(id).then(work => res.render('works/editWorks', work)).catch(err => console.log(err))
})

router.post('/:id/edit', (req, res) => {

    const id = req.params.id
    const {title, author, description} = req.body

    Works.findByIdAndUpdate(id, {title, author, description})
        .then(() =>  res.redirect('/'))
        .catch(err => console.log(err))


})

module.exports = router