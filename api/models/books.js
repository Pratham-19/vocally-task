const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Book',bookSchema);