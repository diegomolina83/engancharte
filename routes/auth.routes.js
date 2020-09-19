let imageUrl
const express = require("express")
const router = express.Router()
const passport = require("passport")
const cdnUploader = require('../configs/cloudinary.config')

const User = require("../models/user.model")
const Picture = require("../models/picture.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10


// User signup
router.get("/signup", (req, res) => res.render("auth/signup"))
router.post("/signup",cdnUploader.single('imageInput'), (req, res, next) => {

    const { username, password,email } = req.body

    if (!username || !password) {
        res.render("auth/signup", { errorMsg: "Rellena el usuario y la contraseña" })
        return
    }

    if (!email) {
        res.render("auth/signup", { errorMsg: "El campo email no puede estar vacío" })
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
   

    User.findOne({$or:[{ username},{email}]})
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "El usuario o el email ya existen en la BBDD" })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)
           
            User.create({ username, password: hashPass, email,imageUrl })
                .then(() => res.redirect("/"))
                .catch(() => res.render("auth/signup", { errorMsg: "No se pudo crear el usuario" }))
        })
        .catch(error => next(error))
})


// User login
router.get('/login', (req, res) => res.render('auth/login', { "errorMsg": req.flash("error") }))
router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: 'Rellena todos los campos'
}))


// User logout
router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/login")
})

module.exports = router