const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    password: String,
    imageUrl: String,
    email:String,
    role:{
        type:String,
        enum:['ADMIN','USER','ARTIST'],
        default:'USER'
      }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User

