const mongoose = require("mongoose")
const Schema = mongoose.Schema
//onst User = require('../models/user.model')
const User = mongoose.model('User')

const workSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    },
    description: {
        type: String
    },
    tematica: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    author: String,

}, {
    timestamps: true
}
)

const Works = mongoose.model('Works', workSchema)

module.exports = Works