import {BACKEND_URL} from "./env.js";

document.addEventListener("DOMContentLoaded", async function() {
    GetAllBook()
    AddEvent()
});

async function GetAllBook () {
    let AllBook = await (await fetch(BACKEND_URL + "/API/Book/" , { method:"GET"})).json()

    AllBook = AllBook.sort((a , b) => {
        if (a.Book_ID < b.Book_ID)
            return -1
    })
    const wrapper = document.getElementById("wrapper")

    for (let i = 0 ; i < AllBook.length ; i++) {
        let newblock = document.createElement("div")
        let Status = AllBook[i].Islending
        if (Status == false)
            newblock.className = "block"
        else
        newblock.className = "block-lending"
        let listt = [AllBook[i].Book_ID , AllBook[i].Book_Name , AllBook[i].Book_Type]
        for (let j = 0 ; j < 3 ; j++) {
            let newtextwrap = document.createElement("div")
            newtextwrap.className = "text-wrapper"
            let newlabel = document.createElement("label")
            newlabel.innerText = listt[j]
            newtextwrap.appendChild(newlabel)
            newblock.appendChild(newtextwrap)
        }
        wrapper.appendChild(newblock)

        newblock.addEventListener("click" , () => {
            window.location.href = "../Book/" + AllBook[i].Book_ID; 
        })
    }
}

function AddEvent() {
    let add_book_button = document.getElementById("add-book-button")
    add_book_button.addEventListener("click" , () => {
        window.location.href = "../Operation/AddBook" ; 
    })
}
