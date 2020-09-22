const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Works = require(`../models/works.model`)


const userSchema = new Schema({
    username: String,
    password: String,
    imageUrl: String,
    email:String,
    role:{
        type:String,
        enum:['ADMIN','USER','ARTIST'],
        default:'USER'
      },
    followedUsers:{
        type:[String]
    },
    likes:{
        type:[String]
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User

