const mongoose = require("mongoose")
const User = require("./user.model")
const Schema = mongoose.Schema

const workSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
       // required: true
    },
    description: {
        type: String
    },
    tematica: {
        type: String
    },
    author: {
        type: String
    },
    price: {
        type: Number,
        required: true
    }  
})

const Works = mongoose.model('Works', workSchema)

module.exports = Works