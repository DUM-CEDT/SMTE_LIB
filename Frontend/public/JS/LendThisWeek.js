import { BACKEND_URL } from "./env.js";

document.addEventListener("DOMContentLoaded", async function () {
    GetAllLend()
    AddEvent()
});

async function GetAllLend() {

    let today = new Date()
    today.setDate(today.getDate())
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

    let datprevmonth = []
    let datthismonth = []
    if (weekstartmonth != thismonth) {
        datprevmonth = await (await fetch(BACKEND_URL + "/API/Lend/" + "QUERY", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Type: "ToPresent",
                Year: weekstartyear,
                Month: weekstartmonth,
                Date: weekstartdate
            })
        })).json()

        datthismonth = await (await fetch(BACKEND_URL + "/API/Lend/" + "QUERY", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Type: "ToPresent",
                Year: thisyear,
                Month: thismonth,
                Date: 1
            })
        })).json()
    }
    else {
        datthismonth = await (await fetch(BACKEND_URL + "/API/Lend/" + "QUERY", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Type: "ToPresent",
                Year: thisyear,
                Month: thismonth,
                Date: weekstartdate
            })
        })).json()
    }

    let AllLend = []

    for (let i = 0; i < datprevmonth.length; i++) {
        AllLend.push(datprevmonth[i])
    }

    for (let i = 0; i < datthismonth.length; i++) {
        AllLend.push(datthismonth[i])
    }


    let wrapper = document.getElementById("wrapper")
    for (let i = AllLend.length - 1; i >= 0; i--) {
        let thislend = AllLend[i]
        let newblock = document.createElement("div")
        if (thislend.Status == 0)
            newblock.className = "block-lending "
        else if (thislend.Status == 1)
            newblock.className = "block"
        else if (thislend.Status == 2)
            newblock.className = "block-non-return"
        else if (thislend.Status == 3)
            newblock.className = "block-must-return-today"

        let arr = [thislend.Student_Name, thislend.Book_Name, thislend.Lend_Date.Date + "/" + thislend.Lend_Date.Month + "/" + thislend.Lend_Date.Year, thislend.Must_Return_Date.Date + "/" + thislend.Must_Return_Date.Month + "/" + thislend.Must_Return_Date.Year]
        for (let j = 0; j < 4; j++) {
            let newtextwrapper = document.createElement("div")
            newtextwrapper.className = "text-wrapper"
            let newlabel = document.createElement("label")
            newlabel.innerText = arr[j]
            newtextwrapper.appendChild(newlabel)
            newblock.appendChild(newtextwrapper)
        }

        wrapper.appendChild(newblock)

    }

}

function AddEvent() {
    let add_book_button = document.getElementById("add-book-button")
    add_book_button.addEventListener("click", () => {
        window.location.href = "./ThisWeek-Export"
    })
}
