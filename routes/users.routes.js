const express = require('express')
const User = require('../models/user.model')
const router = express.Router()
const cdnUploader = require('../configs/cloudinary.config')
const Picture = require('../models/picture.model')




//Listado de usuarios

router.get('/users', (req, res) => {

User.find()
.then(users=>res.render('users/users-list',{users}))
.catch(err=>console.log('Error: ', err))

})


//Borrar usuarios

router.get('/users/delete/:id',(req,res)=>{
    const id = req.params.id
    User.findByIdAndDelete(id)
    .then(()=>res.redirect('/users'))
    .catch(err=>console.log('Error: ', err))
})


//Editar usuarios

router.get('/users/edit/:id',(req,res)=>{
    const id = req.params.id
        User.findByIdAndUpdate(id)
        .then(user=>res.render('users/users-edit',user))
        .catch(err=>console.log('Error: ', err))
})

router.post('/users/edit/:id',cdnUploader.single('imageInput'),(req,res)=>{
    const id = req.params.id
    const {username,email,imageInput,password} = req.body


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
      }

    User.findByIdAndUpdate(id,{username,email,imageUrl,password})
    .then(()=>{res.redirect('/users')})
    .catch(err=>console.log('Error: ', err))
})


module.exports = router