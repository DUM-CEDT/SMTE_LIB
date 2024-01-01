const express = require("express")
const router = express.Router()
const StudentList = require("../models/Student_Model")

router.get("/", async (req, res) => {
    try {
        const AllStudent = await StudentList.find()
        res.status(200).json(AllStudent)
    }
    catch (err) {
        res.status(500).json({ messege: err.messege })
    }

})


router.get("/:studentid", async (req, res) => {
    try {
        let studentid = req.params.studentid
        if (studentid == 'AMOUNT') {
            const CountStudent = await StudentList.countDocuments()
            res.status(200).json({ count: CountStudent })
        }
        else {
            const ThisStudent = await StudentList.findOne({ Student_ID: studentid })
            if (ThisStudent == null)
                res.status(404).json(null)
            else
                res.status(200).json(ThisStudent)
        }

    }
    catch (err) {
        res.status(500).json({ messege: err.messege })
    }

})

router.post("/", async (req, res) => {
    const NewStudent = new StudentList({
        Student_ID: req.body.Student_ID,
        Student_Name: req.body.Student_Name,
        Student_Grade: req.body.Student_Grade,
        Student_Class: req.body.Student_Class,
        Student_Phone: req.body.Student_Phone
    })
    try {
        const AddNewStudent = await NewStudent.save()
        res.status(201).json(AddNewStudent)
    }
    catch (err) {
        res.status(400).json({ messege: err.messege })
    }
})


router.put("/:id" , async(req,res) => {
    const id = req.params.id;
    const Type = req.body.Type;
    try {
        if (Type == "UpdateOne") {
            const UpdateStudent = await StudentList.findOneAndUpdate({Student_ID: id}, 
                {   
                    Student_ID: req.body.Student_ID ,
                    Student_Name : req.body.Student_Name,
                    Student_Grade : req.body.Student_Grade,
                    Student_Class : req.body.Student_Class,
                    Student_Phone : req.body.Student_Phone
                });
            
            res.status(201).json(UpdateStudent)
        }
        else if (Type == "LevelUpUpdate") {
            const UpdateStudent = await StudentList.updateMany({Student_Grade : req.body.FromGrade} , {Student_Grade : req.body.ToGrade})
            res.status(201).json(UpdateStudent)
        }
        else if (Type == "DeleteM3") {
            const DeleteM3 = await StudentList.deleteMany({Student_Grade : 3})
            res.status(204).json(DeleteM3)
        }
        else if (Type == "DeleteM6") {
            const DeleteM6 = await StudentList.deleteMany({Student_Grade : 6})
            res.status(204).json(DeleteM6)
        }
        
        
    }
    catch (err) {
        res.status(400).json({messege : err.messege})
    }

})



async function GetStudentByID(req, res, next) {
    let target
    let searchstudent = req.body.Student_ID
    try {
        target = await StudentList.findOne({ Student_ID: searchstudent })
        if (target == null)
            return res.status(404).json({ messege: "Can't Find Student With ID :" + req.body.Student_ID })
    }
    catch (err) {
        return res.status(500).json({ messege: err.messege })
    }

    res.Student = target
    next()
}

router.delete("/:Student_ID" , async (req , res) => {
    try {
        let Student_ID = req.params.Student_ID
        const deletestudent = await StudentList.findOneAndDelete({Student_ID: Student_ID})
        res.status(204).json({delete : true})
    }
    catch(err) {
        console.error(err)
    }
})


module.exports.GetStudentByID = GetStudentByID
module.exports.router = router