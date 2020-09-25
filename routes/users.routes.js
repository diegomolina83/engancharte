let newFollow = []
let newLikes = []
const express = require('express')
const User = require('../models/user.model')
const Works = require('../models/works.model')
const router = express.Router()
const cdnUploader = require('../configs/cloudinary.config')
const Picture = require('../models/picture.model')
const { get } = require('mongoose')
const bcrypt = require("bcryptjs")
const bcryptSalt = 10

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, incia sesión para continuar' })
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos para ver eso.' })


//Listado de usuarios
router.get('/', checkRole(['ADMIN']), (req, res, next) => {
    User.find()
        .then(users => {
            let msgObj = { msg: "" }
            res.render('users/users-list', { users, msgObj })
        })
        .catch(err => next(err))
})


//Borrar usuarios
router.get('/delete/:id', (req, res, next) => {
    const id = req.params.id
    User.findByIdAndDelete(id)
        .then(() => res.redirect('/users'))
        .catch(err => next(err))
})


//Editar usuarios(GET)
router.get('/edit/:id', checkLoggedIn, (req, res, next) => {
    const id = req.params.id
    User.findByIdAndUpdate(id)
        .then(user => res.render('users/users-edit', user))
        .catch(err => next(err))
})


//Editar usuarios (POST)
router.post('/edit/:id', checkLoggedIn, cdnUploader.single('imageInput'), (req, res, next) => {
    const id = req.params.id
    const { username, email } = req.body
    User.findByIdAndUpdate(id, { username, email })
        .then(() => { res.redirect('back') })
        .catch(err => next(err))
})


//Perfil del propio usuario
router.get('/my-profile/', checkLoggedIn, (req, res, next) => {

    let id = req.user.id
    const userPromise = User.findById(id)
    //Usuarios a los que sigue
    const usersPromise = []
    req.user.followedUsers.forEach(element => {
        User.findById(element)
            .then(user => usersPromise.push(user))
            .catch(err => next(err))

    })
    //Obras que le gustan
    const likes = []
    req.user.likes.forEach(element => {
        Works.findById(element)
            .then(work => {
                console.log(likes)
                likes.push(work)
            })
            .catch(err => next(err))
    })

    //Revisar si se puede hacer con un populate
    Promise.all([userPromise, usersPromise, likes])
        .then(results => res.render('users/my-profile', { user: results[0], users: results[1], likes: results[2] }))
        .catch(err => console.log('Error: ', err))
})


//Perfil de usuarios
router.get('/profile/:id', checkLoggedIn, (req, res, next) => {
    const id = req.params.id
    //controlamos si el botón es "Seguir" o "Dejar de seguir"
    if (req.user.followedUsers.includes(id)) {
        req.app.locals.follow = 'oculto'
        req.app.locals.unfollow = ''
    }
    else {
        req.app.locals.unfollow = 'oculto'
        req.app.locals.follow = ''
    }

    //Datos del usuario
    const userPromise = User.findById(id)
    //Obras del usuario logueado
    const worksPromise = []
    Works.find()
        .populate('user')
        .then(worksUser => {
            worksUser.forEach(element => {
                if (element.user.id == id) {
                    worksPromise.push(element)
                }
            })
        })
        .catch(err => next(err))

    Promise.all([userPromise, worksPromise])
        .then(results => {
            res.render('users/users-profile', { user: results[0], works: results[1] })
        })
        .catch(err => next(err))
})


//Panel de control del administrador
router.get('/admin-control', checkRole(['ADMIN']), (req, res, next) =>
    res.render('users/admin-control'))


//Seguir usuarios
router.get('/follow/:id', checkLoggedIn, (req, res, next) => {
    newFollow = req.user.followedUsers   //El array se llena con los usuarios a los que sigue el user
    if (!req.user.followedUsers.includes(req.params.id)) {
        newFollow.push(req.params.id)
        User.findByIdAndUpdate(req.user.id, { followedUsers: newFollow })
            .then(() => res.redirect('back'))
            .catch(err => next(err))
    }
    else console.log("YA ESTÁ INCLUIDO")
})


//Dejar de seguir
router.get('/unfollow/:id', checkLoggedIn, (req, res, next) => {
    let unfollow = req.user.followedUsers
    if (unfollow.includes(req.params.id)) {
        let index = unfollow.indexOf(req.params.id)
        unfollow.splice(index, 1)
        User.findByIdAndUpdate(req.user.id, { followedUsers: unfollow })
            .then(() => res.redirect('back'))
            .catch(err => next(err))
    }
    else { console.log("No lo seguías") }
})


//Cambiar la contraseña(GET)
router.get('/edit/changePassword/:id', (req, res, next) => {
    let id = req.params.id
    console.log("ID:        ",)
    User.findById(id)
        .then(user => {
            console.log("-------------", user)
            res.render('users/change-password.hbs', user)
        })
        .catch(err => next(err))
})


//Cambiar la contraseña(POST)
router.post('/edit/changePassword/:id', checkLoggedIn, (req, res, next) => {
    const id = req.params.id
    const { password } = req.body
    console.log("Imprime REQBODY: ", req.body,)
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)
    User.findByIdAndUpdate(id, { password: hashPass })
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})


module.exports = router





//Cambiar la imagen
// if (req.file) {

    //     if(req.file.size>2000000){
    //         res.render("auth/signup", { errorMsg: "El tamaño de la imagen no puede ser superior a 2 MB" })
    //         return
    //     } 

    //     Picture.create({
    //         name:req.file.originalname,
    //         path:req.file.path,
    //         originalName: req.file.originalname
    //         })
    //         imageUrl= req.file.path
    //   }