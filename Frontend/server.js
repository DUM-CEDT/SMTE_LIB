import express from "express";
import BookRouter from "./routes/Book.js"
import StudentRouter from "./routes/Student.js"
import OperationRouter from "./routes/Operation.js"
import HistoryRouter from "./routes/History.js"
import path from "path"
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
export const BACKEND_URL = "http://localhost:3000";
export const __dirname = path.dirname(__filename);

const app = express() 
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "/public/views"));
app.use(express.static("public"));
app.use(express.json())

app.listen(3100 , () => console.log("Server Started"))

app.get("/" , (req , res) => {
    res.render("Dashboard.ejs")
})


app.use("/Book" , BookRouter) 
app.use("/Student" , StudentRouter) 
app.use("/Operation" , OperationRouter)
app.use("/History" , HistoryRouter)
