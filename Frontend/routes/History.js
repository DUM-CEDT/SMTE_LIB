import express from "express";
const router = express.Router()

router.get("/Today" , (req , res) => {
    res.render("LendToday")
})
router.get("/Today-Export" , (req , res) => {
    res.render("LendTodayExp")
})

router.get("/ThisWeek" , (req , res) => {
    res.render("LendThisWeek")
})

router.get("/ThisWeek-Export" , (req , res) => {
    res.render("LendThisWeekExp")
})

router.get("/ThisMonth" , (req , res) => {
    res.render("LendThisMonth")
})

router.get("/ThisMonth-Export" , (req , res) => {
    res.render("LendThisMonthExp")
})

router.get("/ThisYear" , (req , res) => {
    res.render("LendThisYear")
})

router.get("/ThisYear-Export" , (req , res) => {
    res.render("LendThisYearExp")
})

export default router

