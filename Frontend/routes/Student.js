import express from "express";
const router = express.Router()

router.get("/" , (req , res) => {
    res.render("StudentList")
})

router.get("/:studentid" , (req , res) => {
    res.render("Studentinfo", {studentid : req.params.studentid}) 
})
export default router