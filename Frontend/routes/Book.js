import express from "express";
import {__dirname} from "../server.js";

const router = express.Router()



router.get("/" , (req , res) => {
    res.render("BookList")
})

router.get("/Lending" , (req , res) => {
    res.render("BookLending")
})

router.get("/ReturnLate" , (req , res) => {
    res.render("BookReturnLate")
})

router.get("/MustReturnToday" , (req , res) => {
    res.render("MustReturnToday")
})

router.get("/:bookid" , (req , res) => {
    res.render("Bookinfo", {bookid : req.params.bookid}) 
})

export default router