let newFollow=[]
const express = require('express')
const User = require('../models/user.model')
const router = express.Router()
const cdnUploader = require('../configs/cloudinary.config')
const Picture = require('../models/picture.model')

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


//Perfil del propio usuario

router.get('/users/my-profile/',checkLoggedIn,(req,res)=>{
let id = req.user.id
const userPromise=User.findById(id)
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

router.get('/users/profile/:id',(req,res)=>{
    


    const id = req.params.id
        
    const userPromise=User.findById(id)
    const usersPromise=[]
    req.user.followedUsers.forEach(element =>{
        User.findById(element)
        .then(user=>usersPromise.push(user))
        .catch(err=>console.log('Error: ', err))
    
    })

   
 Promise.all([userPromise,usersPromise])
 .then(results=>res.render('users/users-profile',{user:results[0],users:results[1]}))    
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
console.log("index---------",index)
console.log("unfollow before",unfollow.length)

unfollow.splice(index,1)
console.log("unfollow after",unfollow.length)
    User.findByIdAndUpdate(req.user.id,{followedUsers:unfollow})
    .then(()=>res.redirect('back'))
    .catch(err=>console.log('Error: ', err))
    }
    else{console.log("No lo seguías")}
})




