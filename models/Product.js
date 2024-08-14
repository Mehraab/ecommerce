const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold:{
        type:Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
    },
    brand: {
        type: String,
        enum:['Apple','Samsung','Asus','Lenevo'],
    },
    image: {
        type: Array,
    },
    color: {
        type: String,
        enum:['Red','Green','Blue','Yellow'],
    },
    ratings: {
        star: Number,
        postedby: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', productSchema);