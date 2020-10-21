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
    price: {
        type: Number,
        required: true
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    tags: {
        type: [String],
        trim: true,
        lowercase: true
    },
    location: {
        type: String,
        required: false
    }
}, {
    timestamps: true
}
)

const Works = mongoose.model('Works', workSchema)

module.exports = Works