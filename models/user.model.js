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
    works: { type: Schema.Types.ObjectId, ref: 'Works'}  
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User

