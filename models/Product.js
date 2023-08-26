const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name : {
        type : String,
        required : true        
    },
    smallDescription: {
        type: String,
        required: true,
    },
    datePublication: {
        type: Date,
        default: Date.now,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    ideaImage: { 
        type: String,
        required: false 
    }
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product;