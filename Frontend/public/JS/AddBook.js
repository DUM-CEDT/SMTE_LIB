import { BACKEND_URL } from "./env.js";

document.addEventListener("DOMContentLoaded" , () => {
    AddEvent()
})

function AddEvent() {
    let submit_button = document.getElementById("submit-button")
    let error_container = document.getElementById("error-container")

    submit_button.addEventListener("click" , async () => {
    let bookid = document.getElementById("Book-ID").value
    let bookname = document.getElementById("Book-Name").value
    let booktype = document.getElementById("Book-Type").value
    
    let thisbook = await(await fetch(BACKEND_URL + "/API/Book/" + bookid)).json()
    
    while (error_container.childNodes.length != 0) {
        error_container.removeChild(error_container.children[0])
    }

    if (thisbook != null) {
        let error_box = document.createElement("div")
        error_box.className = "error-box"
        let error_label = document.createElement("label")
        error_label.innerText = ("มีหนังสือรหัส " + bookid + " อยู่แล้ว")
        error_box.appendChild(error_label)
        error_container.appendChild(error_box)
    }
    else {
        let addbook = (await fetch(BACKEND_URL + "/API/Book/" , {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Type:"UpdateOne",
                Book_ID: bookid ,
                Book_Name : bookname,
                Book_Type : booktype,
                Islending : false
            })
        }))

        if (addbook.status == 201) {
            let error_box = document.createElement("div")
            error_box.className = "success-box"
            let error_label = document.createElement("label")
            error_label.innerText = ("เพิ่มหนังสือรหัส  " + bookid + " สำเร็จ")
            error_box.appendChild(error_label)
            error_container.appendChild(error_box)

            document.getElementById("Book-ID").value = ""
            document.getElementById("Book-Name").value = "" 
            document.getElementById("Book-Type").value = ""

        }
    }
    })
}