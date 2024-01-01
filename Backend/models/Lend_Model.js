const mongoose = require("mongoose")

const DateSchema = new mongoose.Schema ({

    Year : {
        type : Number,
        required : true
    },
    Month : {
        type : Number,
        required : true
    },
    Date : {
        type : Number,
        required : true
    },
    DayOfWeek : {
        type : Number,
        required : true
    }

})

const LendSchema = new mongoose.Schema ({
    Book_ID : {
        type : String,
        required : true
    },
    Book_Name : {
        type : String,
        required : true
    },
    Student_ID : {
        type : String,
        required : true
    },
    Student_Name : {
        type: String,
        required: true
    },
    Lend_Date : {
        type : DateSchema,
        required : true
    },
    Must_Return_Date : {
        type : DateSchema,
        required : true
    },
    Actual_Return_Date  : {
        type : DateSchema
    },
    Status : {
        type : Number,
        default : 0
    }

})


module.exports.Date_Model = mongoose.model("Date_Model" , DateSchema)
module.exports.Lend_Model = mongoose.model("Lend_Model" , LendSchema) 