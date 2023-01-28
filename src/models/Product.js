const mongoose = require('mongoose')

const {Schema} = mongoose

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    image: String,
    description: String,
    sizes: [String]  // this is an array of strings
    
})

module.exports = mongoose.model('Product', productSchema)