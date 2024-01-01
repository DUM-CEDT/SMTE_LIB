const express = require("express")
const router = express.Router()
const LendList = require("../models/Lend_Model").Lend_Model
const DateModel = require("../models/Lend_Model").Date_Model
const Book = require("./Book")
const Student = require("./Student")
const { Lend_Model } = require("../models/Lend_Model")


router.get("/", async (req, res) => {
    try {
        const AllHistory = await LendList.find()
        res.json(AllHistory)
    }
    catch (err) {
        res.status(500).json({ messege: err.messege })
    }
})

router.get("/AMOUNT", async (req, res) => {
    try {
        const CountLend = await LendList.countDocuments()
        res.status(200).json({ count: CountLend })
    }
    catch (err) {
        res.status(500).json({ messege: err.messege })
    }
})

router.post("/", async (req, res) => {
    try {
        let ThisDay = new DateModel({
            Year: req.body.ThisYear,
            Month: req.body.ThisMonth,
            Date: req.body.ThisDate,
            DayOfWeek: req.body.DayInWeek
        })

        let Next7Day = new DateModel({
            Year: req.body.Next7DayYear,
            Month: req.body.Next7DayMonth,
            Date: req.body.Next7DayDate,
            DayOfWeek: req.body.DayInWeek
        })

        let ThisLend = new Lend_Model({
            Book_ID: req.body.Book_ID,
            Book_Name : req.body.Book_Name,
            Student_ID: req.body.Student_ID,
            Student_Name : req.body.Student_Name,
            Lend_Date: ThisDay,
            Must_Return_Date: Next7Day,
            Actual_Return_Date: null,
            Status: 0
        })

        const Make_Lend = await ThisLend.save()
        res.status(200).json(Make_Lend)
    }
    catch (err) {

    }

})

router.put("/:ID", async (req, res) => {
    try {
        const ID = req.params.ID;
        if (req.body.Type == "UPDATELEND") {
            const Updatelend = await LendList.updateMany({ Book_ID: ID, $or: [{ Status: 0 }, { Status: 2 } , { Status: 3}]},
                {
                    Status: 1,
                    Actual_Return_Date: new DateModel({
                        Year: req.body.ThisYear,
                        Month: req.body.ThisMonth,
                        Date: req.body.ThisDate,
                        DayOfWeek: req.body.DayInWeek
                    })
                }
            );
            res.status(201).json(Updatelend)
        }
        else if (req.body.Type == "QUERYLEND_BOOK") {
            const AllLend = await LendList.find({Book_ID: ID})
            res.status(200).json(AllLend)
        }
        else if (req.body.Type == "QUERYLEND_STUDENT") {
            const AllLend = await LendList.find({Student_ID: ID})
            res.status(200).json(AllLend)
        }
        else if (req.body.Type == "UpdateBook") {
            const UpdateBooks = await LendList.updateMany({Book_ID: ID}, {Book_ID : req.body.Book_ID , Book_Name : req.body.Book_Name})
            res.status(201).json(UpdateBooks)
        }
        else if (req.body.Type == "UpdateStudent") {
            const UpdateStudent = await LendList.updateMany({Student_ID: ID}, {Student_ID : req.body.Student_ID , Student_Name : req.body.Student_Name})
            res.status(201).json(UpdateStudent)
        }
        else if (req.body.Type == "LendingBook") {
            const LendingBooks = await LendList.find({$or: [{ Status: 0 }, { Status: 2 } , { Status: 3}]})
            res.status(200).json(LendingBooks)
        }
        else if (req.body.Type == "ReturnLateBook") {
            const ReturnLateBooks = await LendList.find({$or: [{Status: 2 }]})
            res.status(200).json(ReturnLateBooks)
        }
        else if (req.body.Type == "MustReturnTodayBook") {
            const MustReturnTodayBook = await LendList.find({$or: [{Status: 3 }]})
            res.status(200).json(MustReturnTodayBook)
        }
        
        else if (req.body.Type == "ChangeReturnToday") {
            const ChangeReturnTodayLend = await LendList.updateMany({$and: [{"Must_Return_Date.Year": req.body.Date.ThisYear} , {"Must_Return_Date.Month": req.body.Date.ThisMonth} ,{"Must_Return_Date.Date": req.body.Date.ThisDate} , {Status:0}]} , {Status:3})
            res.status(201).json(ChangeReturnTodayLend)
        }
        else if (req.body.Type == "ChangeReturnLate") {
            const ChangeReturnLate = await LendList.updateMany({$and:[{"Must_Return_Date.Date" : {$ne: req.body.Date}}, {Status:3}]} , {Status:2})
            res.status(201).json(ChangeReturnLate)
        }
        else if (req.body.Type == "GetLendToday") {
            const Lendbooks = await LendList.find({$and : [{"Lend_Date.Year" : req.body.Year} , {"Lend_Date.Month" : req.body.Month} , {"Lend_Date.Date" : req.body.Date}]})
            res.status(200).json(Lendbooks)
        }
        else if (req.body.Type == "ToPresent") {
            const LendBooks = await LendList.find({$and : [{"Lend_Date.Year" : req.body.Year} , {"Lend_Date.Month" : {$gte : req.body.Month}} , {"Lend_Date.Date" : {$gte : req.body.Date}}]})
            res.status(200).json(LendBooks)
        }
    }
    catch (err) {
        res.status(400).json({ messege: err.messege })
    }

})


module.exports = router

