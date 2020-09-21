const mongoose = require("mongoose")
const Schema = mongoose.Schema

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
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
}
)

const Works = mongoose.model('Works', workSchema)

module.exports = Works