const express = require("express")
const router = express.Router()
const BookList = require("../models/Book_Model")

router.get("/", async (req, res) => {
    try {
        const AllBook = await BookList.find()
        res.status(200).json(AllBook)
    }
    catch (err) {
        res.status(500).json({ messege: err.messege })
    }

})

router.get("/:bookid", async (req, res) => {
    try {
        let bookid = req.params.bookid
        if (bookid == 'AMOUNT') {
            const CountBook = await BookList.countDocuments()
            res.status(200).json({ count: CountBook })
        }
        else {
            const ThisBook = await BookList.findOne({Book_ID : bookid})
            if (ThisBook == null)
                res.status(404).json(null)
            else
                res.status(200).json(ThisBook)
        }
        
    }
    catch (err) {
        res.status(500).json({ messege: err.messege })
    }

})

router.use("/AMOUNT", async (req, res) => {
    try {
        const CountBook = await BookList.countDocuments()
        res.status(200).json({ count: CountBook })
    }
    catch (err) {
        res.status(500).json({ messege: err.messege })
    }
})

router.post("/", async (req, res) => {

    const NewBook = new BookList({
        Book_ID: req.body.Book_ID,
        Book_Name: req.body.Book_Name,
        Book_Type: req.body.Book_Type
    })
    try {
        const AddNewBook = await NewBook.save()
        res.status(201).json(AddNewBook)
    }
    catch (err) {
        res.status(400).json({ messege: err.messege })
    }

})

router.put("/:Book_ID" , async(req,res) => {
    const bookid = req.params.Book_ID;
    const Type = req.body.Type;
    try {
        if (Type == "UpdateOne") {
            const UpdateBook = await BookList.findOneAndUpdate({Book_ID: bookid}, 
                {   
                    Book_ID: req.body.Book_ID ,
                    Book_Name : req.body.Book_Name,
                    Book_Type : req.body.Book_Type,
                    Islending : req.body.Islending
                });
            res.status(201).json(UpdateBook)
        }
        else if (Type == "ChangeID") {
            const UpdateBooks = await BookList.updateMany({Book_ID: bookid}, {Book_ID : req.body.Book_ID})
            res.status(201).json(UpdateBooks)
        }
        
        
        
    }
    catch (err) {
        res.status(400).json({messege : err.messege})
    }

})

router.delete("/:Book_ID" , async (req , res) => {
    try {
        let Book_ID = req.params.Book_ID
        const deletebook = await BookList.findOneAndDelete({Book_ID: Book_ID})
        res.status(204).json({delete : true})
    }
    catch(err) {
        console.error(err)
    }
})




async function GetBookByID(req, res, next) {
    let target
    let searchbook = req.body.Book_ID
    try {
        target = await BookList.findOne({ Book_ID: searchbook })
        if (target == null)
            return res.status(404).json({ messege: "Cannot Find Book With ID : " + req.body.BOOK_ID })
    }
    catch (err) {
        return res.status(500).json({ messege: err, messege })
    }
    res.Book = target
    next()

}
module.exports.GetBookByID = GetBookByID
module.exports.router = router