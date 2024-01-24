const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    price:{
        type:number,
        required:true,
        min:[0,'Wrong Price']
    },
    brand:{
        type:String,
        required:true,

    },
    category:{
        type:String,
        required:true,
    },
    image:{
        type:String
    }


})

module.exports = mongoose.model('Product',productSchema);