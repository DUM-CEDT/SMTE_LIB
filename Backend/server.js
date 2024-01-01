require("dotenv").config({path : "../.env"})

const express = require("express")
const app = express() 
const cors = require('cors');

const mongoose = require("mongoose")

mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log("Connected to Database"))
.catch((err) => console.error(err))

app.use(express.json())

app.use(
  cors ({
    origin : "http://localhost:3100",
    credential : true,
  })
)

const BookRouter = require("./routes/Book")
const StudentRouter = require("./routes/Student")
const LendRouter = require("./routes/Lend")

app.use("/API/Book" , BookRouter.router) 
app.use("/API/Student" , StudentRouter.router) 
app.use("/API/Lend" , LendRouter) 

app.listen(3000 , () => console.log("Server Started"))

