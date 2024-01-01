import { BACKEND_URL } from "./env.js";

document.addEventListener("DOMContentLoaded", async function () {
    GetAllLendingBook()
});

async function GetAllLendingBook() {
    let AllLendingHistory = await (await fetch(BACKEND_URL + "/API/Lend/" + "QUERY",
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Type: "LendingBook",
        })})).json()

    const wrapper = document.getElementById("wrapper")

    for (let i = AllLendingHistory.length - 1; i >= 0; i--) {
        let newblock = document.createElement("div")
        let thishistory = AllLendingHistory[i]
        if (thishistory.Status == 0)
            newblock.className = "block-lending"
        else if (thishistory.Status == 2)
            newblock.className = "block-return-late"
        else if (thishistory.Status == 3)
            newblock.className = "block-must-return-today"

        let listt = [thishistory.Book_Name, thishistory.Student_Name , thishistory.Lend_Date.Date.toString() + "/" + thishistory.Lend_Date.Month.toString() + "/" + thishistory.Lend_Date.Year.toString() , thishistory.Must_Return_Date.Date.toString() + "/" + thishistory.Must_Return_Date.Month.toString() + "/" + thishistory.Must_Return_Date.Year.toString()]
        for (let j = 0; j < 4; j++) {
            let newtextwrap = document.createElement("div")
            newtextwrap.className = "text-wrapper"
            let newlabel = document.createElement("label")
            newlabel.innerText = listt[j]
            newtextwrap.appendChild(newlabel)
            newblock.appendChild(newtextwrap)
        }
        wrapper.appendChild(newblock)

        newblock.addEventListener("click", () => {
            window.location.href = "../Book/" + AllBook[i].Book_ID;
        })
    }
}

