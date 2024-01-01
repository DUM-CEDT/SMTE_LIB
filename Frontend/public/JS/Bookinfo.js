import { BACKEND_URL } from "./env.js";

document.addEventListener("DOMContentLoaded", async () => {
    LOAD_LABEL()
    LOAD_HISTORY()
    ADD_EVENT_EDIT()
    ADD_EVENT_DELETE()
})

async function LOAD_LABEL() {
    try {
        let bookid = document.getElementById("bookid").className
        let thisbook = await (await fetch(BACKEND_URL + "/API/Book/" + bookid)).json()
        let book_id_label = document.getElementById("book-id-label")
        let book_name_label = document.getElementById("book-name-label")
        let book_type_label = document.getElementById("book-type-label")
        let islending_label = document.getElementById("islending-label")
        if (thisbook != null) {
            book_id_label.innerText = thisbook.Book_ID
            book_name_label.innerText = thisbook.Book_Name
            book_type_label.innerText = thisbook.Book_Type

            if (thisbook.Islending == true) {
                islending_label.innerText = "กำลังถูกยืม"
            }
            else {
                islending_label.innerText = "ไม่ได้ถูกยืม"
            }
        }
    }
    catch (err) {
        console.error(err)
    }

}

async function LOAD_HISTORY() {
    try {
        let book_id = document.getElementById("bookid").className
        let history = await (await fetch(BACKEND_URL + "/API/Lend/" + book_id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Type: "QUERYLEND_BOOK",
            })

        })).json()


        for (let i = history.length - 1; i >= 0; i--) {
            let thishistory = history[i]
            let newblock = document.createElement("div")
            newblock.className = "block"
            if (thishistory.Status == 1)
                newblock.className = "block"
            else
                newblock.className = "block-lending"

            let newtextwrap1 = document.createElement("div")
            let newtextwrap2 = document.createElement("div")
            let newtextwrap3 = document.createElement("div")
            newtextwrap1.className = "text-wrapper"
            newtextwrap2.className = "text-wrapper"
            newtextwrap3.className = "text-wrapper"
            let name_label = document.createElement("label")
            name_label.innerText = history[i].Student_Name
            let lend_date_label = document.createElement("label")
            lend_date_label.innerText = thishistory.Lend_Date.Date.toString() + "/" + thishistory.Lend_Date.Month.toString() + "/" + thishistory.Lend_Date.Year.toString()
            let return_date_label = document.createElement("lebel")
            if (thishistory.Actual_Return_Date != null)
                return_date_label.innerText = thishistory.Actual_Return_Date.Date.toString() + "/" + thishistory.Actual_Return_Date.Month.toString() + "/" + thishistory.Actual_Return_Date.Year.toString()
            else
                return_date_label.innerText = "-"
            newtextwrap1.appendChild(name_label)
            newtextwrap2.appendChild(lend_date_label)
            newtextwrap3.appendChild(return_date_label)
            newblock.appendChild(newtextwrap1)
            newblock.appendChild(newtextwrap2)
            newblock.appendChild(newtextwrap3)
            document.getElementById("block-wrapper").appendChild(newblock)
        }
    }
    catch (err) {
        console.error(err)
    }

}

function ADD_EVENT_EDIT() {

    let edit_button = document.getElementById("edit-button")
    edit_button.addEventListener("click", () => {
    let book_id_label = document.getElementById("book-id-label").innerText
    let book_name_label = document.getElementById("book-name-label").innerText
    let book_type_label = document.getElementById("book-type-label").innerText
    let is_lending_label = document.getElementById("islending-label").innerText
    let inform_card = document.getElementById("inform-card")
    let cl = inform_card.children.length
    for (let i = cl - 1; i >= cl - 4; i--) {
        inform_card.removeChild(inform_card.children[i])
    }

    let listt = [book_id_label, book_name_label, book_type_label, is_lending_label]
    let idd = ["book_id_form", "book_name_form", "book_type_form", "is_lending_form"]
    for (let i = 0; i < 4; i++) {
        let newform = document.createElement("input")
        newform.id = idd[i]
        newform.value = listt[i]
        inform_card.appendChild(newform)
    }
    inform_card.children[inform_card.children.length - 1].disabled = true


    let op_card = document.getElementById("op-card")
    op_card.removeChild(op_card.children[0])

    let confirm_button = document.createElement("button")
    confirm_button.id = "confirm-button"
    confirm_button.innerText = "ยืนยัน"

    confirm_button.addEventListener("click" , async () => {
        try {
            
            let book_id_form = document.getElementById("book_id_form")
            let book_id_val = book_id_form.value
            let Actual_id = document.getElementById("bookid").className
            
            let new_name = document.getElementById("book_name_form").value
            let new_type = document.getElementById("book_type_form").value

            
                let target_book = await (await fetch(BACKEND_URL + "/API/Book/" + book_id_val)).json()
                if (target_book != null && Actual_id != book_id_val) {
                    let noti_bar = document.getElementById("noti-bar")
                    noti_bar.className = "noti-bar"
                    noti_bar.innerText = "มีหนังสือรหัส " + book_id_val + " อยู่แล้ว"
                }
                else {
                    let thisbook = await (await fetch(BACKEND_URL + "/API/Book/" + Actual_id)).json()
                    let update = await (await fetch(BACKEND_URL + "/API/Book/" + Actual_id , {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            Type:"UpdateOne",
                            Book_ID: book_id_val,
                            Book_Name: new_name,
                            Book_Type: new_type,
                            Islending: thisbook.Islending
                    })  
                    })).json()
                    console.log(new_name)
                    let updatelend = (await fetch(BACKEND_URL + "/API/Lend/" + Actual_id , {
                        method : "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            Type: "UpdateBook",
                            Book_ID: book_id_val,
                            Book_Name : new_name
                        })
                    }))

                    window.location.href = "./" + book_id_val
                }
        }
        catch (err) {
            console.error(err)
        }
        
    })

    let cancel_button = document.createElement("button")
    cancel_button.id = "cancel-button"
    cancel_button.innerText = "ยกเลิก"
    cancel_button.addEventListener ("click" ,async () => {
        
        let Actual_id = document.getElementById("bookid").className
        let thisbookk = await (await (fetch(BACKEND_URL + "/API/Book/" + Actual_id))).json()
        let ISLENDING = document.getElementById("is_lending_form").value
        let cll = inform_card.children.length
        for (let i = cll - 1; i >= cll - 4; i--) {
            inform_card.removeChild(inform_card.children[i])
        }
        let arrr = [thisbookk.Book_ID , thisbookk.Book_Name , thisbookk.Book_Type , ISLENDING]
        let listtt = ["book-id-label" , "book-name-label" , "book-type-label" , "islending-label"]
        for (let i = 0 ; i < 4 ; i++) {
            let newlabel = document.createElement("label")
            newlabel.id = listtt[i]
            newlabel.innerText = arrr[i]
            inform_card.appendChild(newlabel)
        }

        op_card.removeChild(op_card.children[0])
        op_card.removeChild(op_card.children[0])

        let new_edit_button = document.createElement("button")
        new_edit_button.id = "edit-button"
        new_edit_button.innerText = "แก้ไขข้อมูล"

        op_card.insertBefore(new_edit_button , op_card.children[0])
        ADD_EVENT_EDIT()


    })
    op_card.insertBefore(cancel_button , op_card.children[0])
    op_card.insertBefore(confirm_button , op_card.children[0])
    

    })

}

function ADD_EVENT_DELETE () {
    let delete_button = document.getElementById("delete-button")
    let Actual_id = document.getElementById("bookid").className
    delete_button.addEventListener ("click" , async () => {
        if (confirm("ยืนยันการลบหนังสือ") == true) {
            let deletee = (await (fetch(BACKEND_URL + "/API/Book/" + Actual_id , {
                method : "DELETE"
            })))
            window.location.href = "../Book/" 
        }
    })

    

}


