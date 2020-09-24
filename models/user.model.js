const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Works = require(`../models/works.model`)


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        maxlength: 20,
        minlength: 3,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength:4,
    },
    imageUrl: {
        type: String,
        default: '/images/defecto.png',
    },
    email: {
        type: String
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER', 'ARTIST'],
        default: 'USER'
    },
    followedUsers: {
        type: [String],
        default:[]
    },
    likes: {
        type: [String],
        default: []
    },
    cart: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)

module.exports = User

