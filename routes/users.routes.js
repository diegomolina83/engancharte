let newFollow=[]
const express = require('express')
const User = require('../models/user.model')
const Works = require('../models/works.model')
const router = express.Router()
const cdnUploader = require('../configs/cloudinary.config')
const Picture = require('../models/picture.model')
const { get } = require('mongoose')

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, incia sesión para continuar' })
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos para ver eso.' })



//Listado de usuarios

router.get('/users',checkRole(['ADMIN']), (req, res) => {

User.find()
.then(users=>{
    let msgObj={msg:""}
    res.render('users/users-list',{users,msgObj})})
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

router.get('/users/edit/:id',checkLoggedIn,(req,res)=>{
    const id = req.params.id
        User.findByIdAndUpdate(id)
        .then(user=>res.render('users/users-edit',user))
        .catch(err=>console.log('Error: ', err))
})

router.post('/users/edit/:id',checkLoggedIn,cdnUploader.single('imageInput'),(req,res)=>{
    const id = req.params.id
    const {username,email} = req.body

//dejar esto para modificar imagen y contraseña en otras vistas
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

    User.findByIdAndUpdate(id,{username,email})
    .then(()=>{res.redirect('back')})
    .catch(err=>console.log('Error: ', err))
})

//Cambiar la contraseña




//Perfil del propio usuario

router.get('/users/my-profile/',checkLoggedIn,(req,res)=>{
//Datos del usuario
let id = req.user.id
const userPromise=User.findById(id)
//Usuarios a los que sigue
const usersPromise=[]
req.user.followedUsers.forEach(element =>{
    User.findById(element)
    .then(user=>usersPromise.push(user))
    .catch(err=>console.log('Error: ', err))

})


Promise.all([userPromise,usersPromise])
.then(results=>res.render('users/my-profile',{user:results[0],users:results[1]}))    
.catch(err=>console.log('Error: ', err))


})



//Perfil de usuarios

router.get('/users/profile/:id',checkLoggedIn,(req,res)=>{
    


    const id = req.params.id
//controlamos si el botón es "Seguir" o "Dejar de seguir"
if(req.user.followedUsers.includes(id))  {
    req.app.locals.follow='oculto'
    req.app.locals.unfollow=''}
else {
    req.app.locals.unfollow='oculto'
    req.app.locals.follow=''
}

//Datos del usuario
    const userPromise=User.findById(id)

    // if()
//Sus obras
    const worksPromise=[]
    
    Works.find()
    .populate('user')
    .then(worksUser =>{
        worksUser.forEach(element => {
        if(element.user.id == id){
            worksPromise.push(element)
        }
    })
    
    })        
    .catch(err => console.log(err))

console.log(worksPromise)
   
 Promise.all([userPromise,worksPromise])
 .then(results=>res.render('users/users-profile',{user:results[0],works:results[1]}))    
 .catch(err=>console.log('Error: ', err))

    
})

//admin controls

router.get('/users/admin-control',checkRole(['ADMIN']),(req,res)=>res.render('users/admin-control'))


module.exports = router




//Seguir usuarios

router.get('/users/follow/:id',checkLoggedIn,(req,res)=>{
newFollow=req.user.followedUsers   //El array se llena con los usuarios a los que sigue el user
if(!req.user.followedUsers.includes(req.params.id)){
    newFollow.push(req.params.id)
    User.findByIdAndUpdate(req.user.id,{followedUsers:newFollow})
    .then(()=>res.redirect('back'))
    .catch(err=>console.log('Error: ', err))
}

else console.log("YA ESTÁ INCLUIDO") 
})



//Dejar de seguir

router.get('/users/unfollow/:id',checkLoggedIn,(req,res)=>{
    
let unfollow= req.user.followedUsers

    if(unfollow.includes(req.params.id)){
               
let index= unfollow.indexOf(req.params.id)
unfollow.splice(index,1)

    User.findByIdAndUpdate(req.user.id,{followedUsers:unfollow})
    .then(()=>res.redirect('back'))
    .catch(err=>console.log('Error: ', err))
    }
    else{console.log("No lo seguías")}
})




