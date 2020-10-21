let imageUrl
const express = require("express")
const router = express.Router()
const passport = require("passport")
const cdnUploader = require('../configs/cloudinary.config')

const User = require("../models/user.model")
const Picture = require("../models/picture.model")

const bcrypt = require("bcryptjs")
const bcryptSalt = 10

const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos para ver eso.' })


// User signup(GET)
router.get("/signup", (req, res) => res.render("auth/signup"))


//User signup (POST)
router.post("/signup", cdnUploader.single('imageInput'), (req, res, next) => {
    const { username, password, email, role } = req.body
    if (!username || !password) {
        res.render("auth/signup", { errorMsg: "Rellena el usuario y la contraseña" })
        return
    }
    if (!email) {
        res.render("auth/signup", { errorMsg: "El campo email no puede estar vacío" })
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
            .then(() => console.log("Imagen subida"))
            .catch(err => next(err))
        imageUrl = req.file.path
    } else {
        imageUrl = '/images/defecto.png'
    }
    User.findOne({ $or: [{ username }, { email }] })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "El usuario o el email ya existen en la BBDD" })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)
            User.create({ username, password: hashPass, email, imageUrl, role })
                .then(() => res.redirect("/"))
                .catch(() => res.render("auth/signup", { errorMsg: "No se pudo crear el usuario" }))
        })
        .catch(err => next(err))
})


// User login(GET)
router.get('/login', (req, res) =>
    res.render('auth/login', { "errorMsg": req.flash("error") }))


// User login (POST)    
router.post('/login', passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: 'Rellena todos los campos'
}), (req, res) => { //Con esto redirigimos el flujo de Admin hacia el panel de control y añadimos elementos a la nav bar propios del ADMIN
    if (req.user.role == 'ADMIN') {
        req.app.locals.cerrar = ''
        req.app.locals.admin = ""
        req.app.locals.profile = 'oculto'
        req.app.locals.crearObra = 'oculto'
        req.app.locals.verMisObras = 'oculto'
        req.app.locals.iniciar = 'oculto'
        req.app.locals.registro = 'oculto'
        res.redirect('/users/admin-control')
    }
    else if (req.user.role == 'USER') {
        req.app.locals.cerrar = ''
        req.app.locals.admin = 'oculto'
        req.app.locals.profile = ''
        req.app.locals.crearObra = 'oculto'
        req.app.locals.verMisObras = 'oculto'
        req.app.locals.iniciar = 'oculto'
        req.app.locals.registro = 'oculto'
        req.app.locals.shop = ''
        res.redirect('/')
    } else if (req.user.role == 'ARTIST') {
        console.log("soy un artista")
        req.app.locals.cerrar = ''
        req.app.locals.admin = 'oculto'
        req.app.locals.profile = ''
        req.app.locals.crearObra = ''
        req.app.locals.verMisObras = ''
        req.app.locals.iniciar = 'oculto'
        req.app.locals.registro = 'oculto'
        req.app.locals.shop = ''
        res.redirect('/')
    }
    else {
        req.app.locals.cerrar = 'oculto'
        req.app.locals.admin = 'oculto'
        req.app.locals.profile = 'oculto'
        req.app.locals.crearObra = 'oculto'
        req.app.locals.verMisObras = 'oculto'
        req.app.locals.iniciar = ''
        req.app.locals.registro = ''
        res.redirect('/')
    }
})


// User logout
router.get("/logout", (req, res) => {
    req.app.locals.cerrar = 'oculto'
    req.app.locals.admin = 'oculto'
    req.app.locals.profile = 'oculto'
    req.app.locals.crearObra = 'oculto'
    req.app.locals.verMisObras = 'oculto'
    req.app.locals.iniciar = ''
    req.app.locals.registro = ''
    req.logout()
    res.redirect("/login")
})


module.exports = router