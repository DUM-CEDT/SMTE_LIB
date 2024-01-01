const mongoose = require("mongoose")

const StudentSchema = new mongoose.Schema ({
    Student_ID : {
        type: String,
        required : true
    },
    Student_Name : {
        type : String,
        required : true
    },
    Student_Grade : {
        type : Number,
        required : true
    },
    Student_Class : {
        type : Number,
        required : true 
    },
    Student_Phone: {
        type : String,
        required : true
    }

})

module.exports = mongoose.model("Student_Model" , StudentSchema) 