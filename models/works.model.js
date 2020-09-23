const mongoose = require("mongoose")
const Schema = mongoose.Schema

const workSchema = new Schema({
    title: {
        type: String,
        required: true,
        default: 'Sin titulo'
    },
    imageUrl: {
        type: String,
    },
    description: {
        type: String,
        minlength: 10,
        maxlength: 500
    },
    tematica: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    author: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    tags:[String],
    likes: {
        type: [Number]
    },
    location : {
        type: String
    }
}, {
    timestamps: true
}
)

const Works = mongoose.model('Works', workSchema)

module.exports = Works