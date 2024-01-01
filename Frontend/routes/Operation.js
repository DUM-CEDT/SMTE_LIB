import express from "express";
const router = express.Router()

import LendOperation from "./LendOperation.js"
import ReturnOperation from "./ReturnOperation.js"
import AddBookOperation from "./AddBookOperation.js"
import AddStudentOperation from "./AddStudentOperation.js"

router.use("/Lend" , LendOperation)
router.use("/Return" , ReturnOperation)
router.use("/AddBook" , AddBookOperation)
router.use("/AddStudent" , AddStudentOperation)

export default router