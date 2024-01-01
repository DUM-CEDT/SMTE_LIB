import { BACKEND_URL } from "./env.js";

let submit_button = document.getElementById("submit-button")
let student_id_inp = document.getElementById("Student-ID")
let book_id_inp = document.getElementById("Book-ID")
let error_container = document.getElementById("error-container")

submit_button.addEventListener("click", async () => {

    try {
        let student_id = student_id_inp.value
        let book_id = book_id_inp.value
        let thisstudent = await (await fetch(BACKEND_URL + "/API/Student/" + student_id)).json()
        let thisbook = await (await fetch(BACKEND_URL + "/API/Book/" + book_id)).json()
        console.log(thisstudent)

        while (error_container.childNodes.length != 0) {
            error_container.removeChild(error_container.children[0])
        }

        let canfetch = true

        if (thisstudent == null) {
            canfetch = false
            let error_box = document.createElement("div")
            error_box.className = "error-box"
            let error_label = document.createElement("label")
            error_label.innerText = ("ไม่พบข้อมูลนักเรียนรหัส " + student_id)
            error_box.appendChild(error_label)
            error_container.appendChild(error_box)
        }
        if (thisbook == null) {
            canfetch = false
            let error_box = document.createElement("div")
            error_box.className = "error-box"
            let error_label = document.createElement("label")
            error_label.innerText = ("ไม่พบข้อมูลหนังสือรหัส " + book_id)
            error_box.appendChild(error_label)
            error_container.appendChild(error_box)
        }
        else if (thisbook.Islending == true) {
            canfetch = false
            let error_box = document.createElement("div")
            error_box.className = "error-box"
            let error_label = document.createElement("label")
            error_label.innerText = ("หนังสือรหัส " + book_id + " กำลังถูกยืมอยู่")
            error_box.appendChild(error_label)
            error_container.appendChild(error_box)
        }

        if (canfetch) {
            let thisday = new Date()
            let next7day = new Date()
            next7day.setDate(next7day.getDate() + 7)

            let dayinweek = thisday.getDay()
            dayinweek -= 1
            if (dayinweek < 0) {
                dayinweek += 7;
            }
            let data = {
                Student_ID: student_id,
                Student_Name : thisstudent.Student_Name,
                Book_ID: book_id,
                Book_Name : thisbook.Book_Name,

                ThisYear: thisday.getFullYear() + 543,
                ThisMonth: thisday.getMonth() + 1,
                ThisDate: thisday.getDate(),


                Next7DayYear: next7day.getFullYear() + 543,
                Next7DayMonth: next7day.getMonth() + 1,
                Next7DayDate: next7day.getDate(),

                DayInWeek: dayinweek
            }
            let post = await fetch(BACKEND_URL + "/API/Lend/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            let status = post.status

            if (status == 200) {
                
                let updatelendbook = await fetch(BACKEND_URL + "/API/Book/" + book_id , {
                    method : "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Type:"UpdateOne",
                        Book_ID: thisbook.BOOK_ID ,
                        Book_Name : thisbook.Book_Name,
                        Book_Type : thisbook.Book_Type,
                        Islending : true
                    }),
                })
                
                let error_box = document.createElement("div")
                error_box.className = "success-box"
                let error_label = document.createElement("label")
                error_label.innerText = ("ทำการยืมหนังสือรหัส " + book_id + " สำเร็จ")
                error_box.appendChild(error_label)
                error_container.appendChild(error_box)
            }
            student_id_inp.value = ""
            book_id_inp.value = ""

        }

        
    }
    catch (err) {
        console.error(err)
    }

})