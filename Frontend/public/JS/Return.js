import { BACKEND_URL } from "./env.js";
let submit_button = document.getElementById("submit-button")
let book_id_inp = document.getElementById("Book-ID")
let error_container = document.getElementById("error-container")

submit_button.addEventListener("click", async () => {
    try {
        let book_id = book_id_inp.value

        let thisbook = await (await fetch(BACKEND_URL + "/API/Book/" + book_id)).json()
        let canfetch = true

        
        while (error_container.childNodes.length != 0) {
            error_container.removeChild(error_container.children[0])
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
        else if (thisbook.Islending == false) {
            canfetch = false
            let error_box = document.createElement("div")
            error_box.className = "error-box"
            let error_label = document.createElement("label")
            error_label.innerText = ("หนังสือรหัส " + book_id + " ยังไม่ได้ถูกยืม")
            error_box.appendChild(error_label)
            error_container.appendChild(error_box)
        }


        if (canfetch) {

            let thisday = new Date()
            let nowdate = thisday.getDate()
            let nowmonth = thisday.getMonth() + 1
            let nowyear = thisday.getFullYear() + 543
            let dayinweek = thisday.getDay()
            dayinweek -= 1
            if (dayinweek < 0) {
                dayinweek += 7;
            }

            let changelendstat = await fetch(BACKEND_URL + "/API/Lend/" + book_id, {
                method: "PUT",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({
                    Type:"UPDATELEND",
                    ThisDate: nowdate,
                    ThisMonth: nowmonth,
                    ThisYear: nowyear,
                    DayInWeek : dayinweek
                })

            })

            let changebookstat = await fetch(BACKEND_URL + "/API/Book/" + book_id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Type:"UpdateOne",
                    Book_ID: thisbook.Book_ID,
                    Book_Name: thisbook.Book_Name,
                    Book_Type: thisbook.Book_Type,
                    
                    Islending: false
                })
            })
            
            if (changebookstat.status == 201) {
                let error_box = document.createElement("div")
                error_box.className = "success-box"
                let error_label = document.createElement("label")
                error_label.innerText = ("ทำการคืนสำเร็จ")
                error_box.appendChild(error_label)
                error_container.appendChild(error_box)
            }

            book_id_inp.value = ""
        }
    }
    catch (err) {
        console.error(err)
    }
})