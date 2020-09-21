const express = require('express')
const router = express.Router()
const Works = require('../models/works.model')
const Picture = require('../models/picture.model')
const cdnUploader = require('../configs/cloudinary.config')
const User = require('../models/user.model')

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, incia sesión para continuar' })
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos para ver eso.' })



//Lista de obras
router.get('/works', (req, res, next) => {
    Works.find({}).then(works => { res.render('works/indexWorks', {works})})
})




//Crear obras
router.get('/works/create', (req, res, next) => res.render("works/createWorks"))

router.post('/works/create',checkLoggedIn ,cdnUploader.single('imageInput'),(req, res, next) => { 
    
    
    const {title, description, tematica, author, price} = req.body

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
      }else{
          imageUrl='../images/defecto.png'
      }


    Works.create({title, description, tematica, imageUrl, author:req.user, price})
        .then(res.redirect('/'))
})

router.get('/works/details/:id', (req, res, next) => {
    const id = req.params.id

     Works.findById(id).then(work => res.render('works/detailsWorks', {work}))
})

module.exports = router