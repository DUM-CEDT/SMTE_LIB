import express from "express";
const router = express.Router()

router.get("/" , (req , res) => {
    res.render("AddStudent")
})

export default router

