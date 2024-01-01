import { BACKEND_URL } from "./env.js";

document.addEventListener("DOMContentLoaded", async function () {
  await Update_Return_Late_Status()
  await Update_Lend_Status()
  Assign_Link()
  Update_ALL()
});

function Update_ALL() {
  Update_Student()
  Update_Book()
  Update_Lending_Book()
  Assign_Book_Return_Late_Link()
  Assign_Book_Must_Return_Today()
  Assign_History_Link()
}

async function Update_Student() {
  let total_student_label = document.getElementById("total-student-label")
  let res = await (await fetch(BACKEND_URL + "/API/Student/AMOUNT")).json()
  let total_student = res.count
  total_student_label.innerText = total_student + " คน"
}

async function Update_Book() {
  let total_book_label = document.getElementById("total-book-label")
  let res = await (await fetch(BACKEND_URL + "/API/Book/AMOUNT")).json()
  let total_book = res.count
  total_book_label.innerText = total_book + " เล่ม"
}

async function Update_Lending_Book() {

  let res = await (await fetch(BACKEND_URL + "/API/Lend")).json()

  let lendtoday = 0
  let lendthisweek = 0
  let lendthismonth = 0
  let lendthisyear = 0

  let nowlending = 0
  let notreturn = 0
  let mustreturntoday = 0

  let today = new Date()

  let thisdate = today.getDate()
  let thismonth = today.getMonth() + 1
  let thisyear = today.getFullYear() + 543

  let thisday = (today.getDay()) - 1
  if (thisday < 0)
    thisday += 7

  let weekstart = new Date()
  weekstart.setDate(weekstart.getDate() - thisday)

  let weekstartdate = weekstart.getDate()
  let weekstartmonth = weekstart.getMonth() + 1
  let weekstartyear = weekstart.getFullYear() + 543

  for (let i = 0; i < res.length; i++) {

    let D = res[i].Lend_Date

    if (D.Year == weekstartyear) {
      if (D.Month == weekstartmonth) {
        if (D.Date >= weekstartdate)
          lendthisweek++
      }
      else if (D.Month == weekstartmonth - 1 && D.Date >= weekstartdate) {
        lendthisweek++
      }
    }
    else if (D.Year == weekstartyear - 1 && D.Month == 12 && D.Date >= weekstartdate)
      lendthisweek++

    if (D.Year == thisyear && D.Month == thismonth && D.Date == thisdate)
      lendtoday++

    if (D.Year == thisyear && D.Month == thismonth)
      lendthismonth++

    if (D.Year == thisyear)
      lendthisyear++

    if (res[i].Status != 1)
      nowlending++

    if (res[i].Status == 2)
      notreturn++

    let M = res[i].Must_Return_Date
    if (M.Year == thisyear && M.Month == thismonth && M.Date == thisdate)
      mustreturntoday++

  }

  let daily_lending_label = document.getElementById("daily-lending-label")
  daily_lending_label.innerText = lendtoday + " ครั้ง"

  let weekly_lending_label = document.getElementById("weekly-lending-label")
  weekly_lending_label.innerText = lendthisweek + " ครั้ง"

  let monthly_lending_label = document.getElementById("monthly-lending-label")
  monthly_lending_label.innerText = lendthismonth + " ครั้ง"

  let yearly_lending_label = document.getElementById("yearly-lending-label")
  yearly_lending_label.innerText = lendthisyear + " ครั้ง"

  let total_lending_label = document.getElementById("total-lending-label")
  total_lending_label.innerText = nowlending + " เล่ม"

  let non_return_label = document.getElementById("non-return-label")
  non_return_label.innerText = notreturn + " เล่ม"

  let must_return_today_label = document.getElementById("must-return-today-label")
  must_return_today_label.innerText = mustreturntoday + " เล่ม"

}

function Assign_Link() {
  Assign_Student_Link()
  Assign_Book_Link()
  Assign_Button()
  Assign_Book_Lending_Link()
}


function Assign_Student_Link() {
  const total_student_box = document.getElementById("total-student-box")
  total_student_box.addEventListener("click", () => {
    window.location.href = "./Student";
  })
}

function Assign_Book_Link() {
  const total_book_box = document.getElementById("total-book-box")
  total_book_box.addEventListener("click", () => {
    window.location.href = "./Book";
  })
}

function Assign_Button() {
  let lend_book_button = document.getElementById("lend-book-button")
  lend_book_button.addEventListener("click", () => {
    window.location.href = "./Operation/Lend";
  })

  let return_book_button = document.getElementById("return-book-button")
  return_book_button.addEventListener("click", () => {
    window.location.href = "./Operation/Return";
  })

}

function Assign_Book_Lending_Link() {
  const lending_book_box = document.getElementById("lending-book-box")
  lending_book_box.addEventListener("click", () => {
    window.location.href = "./Book/Lending";
  })
}

function Assign_Book_Return_Late_Link() {
  const non_return_box = document.getElementById("non-return-book-box")
  non_return_box.addEventListener("click", () => {
    window.location.href = "./Book/ReturnLate";
  })
}


async function Update_Lend_Status() {
  let thisday = new Date()

  let dayinweek = thisday.getDay()
  dayinweek -= 1
  if (dayinweek < 0) {
    dayinweek += 7;
  }
  let data = {
    ThisYear: thisday.getFullYear() + 543,
    ThisMonth: thisday.getMonth() + 1,
    ThisDate: thisday.getDate(),
  }

  const updatemustreturntoday = fetch(BACKEND_URL + "/API/Lend/" + "QUERY",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Type: "ChangeReturnToday",
        Date: data
      }),
    })
}

async function Update_Return_Late_Status() {
  let thisday = new Date()

  let ThisDate= thisday.getDate()
  const updatereturnlatestatus = fetch(BACKEND_URL + "/API/Lend/" + "QUERY",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Type: "ChangeReturnLate",
        Date: ThisDate
      }),
    })
}

function Assign_Book_Must_Return_Today() {
  const non_return_box = document.getElementById("must-return-today")
  non_return_box.addEventListener("click", () => {
    window.location.href = "./Book/MustReturnToday";
  })
  
}

function Assign_History_Link() {
  let lendtoday = document.getElementById("daily")
  lendtoday.addEventListener("click" , () => {
    window.location.href = "./History/Today";
  })

  let lendthisweek = document.getElementById("weekly")
  lendthisweek.addEventListener("click" , () => {
    window.location.href = "./History/ThisWeek";
  })

  let lendthismonth = document.getElementById("monthly")
  lendthismonth.addEventListener("click" , () => {
    window.location.href = "./History/ThisMonth";
  })

  let lendthisyear = document.getElementById("yearly")
  lendthisyear.addEventListener("click" , () => {
    window.location.href = "./History/ThisYear";
  })



}