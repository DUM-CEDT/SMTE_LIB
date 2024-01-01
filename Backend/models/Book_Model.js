const mongoose = require("mongoose")

const BookSchema = new mongoose.Schema ({
    Book_ID : {
        type: String,
        required : true
    },
    Book_Name : {
        type : String,
        required : true
    },
    Book_Type : {
        type : String,
    },
    Islending : {
        type : Boolean,
        default : false
    }

})

module.exports = mongoose.model("Book_Model" , BookSchema) 