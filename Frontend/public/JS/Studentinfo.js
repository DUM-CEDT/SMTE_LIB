import { BACKEND_URL } from "./env.js";

document.addEventListener("DOMContentLoaded", async () => {
    LOAD_LABEL()
    LOAD_HISTORY()
    ADD_EVENT_EDIT()
    ADD_EVENT_DELETE()
})

async function LOAD_LABEL() {
    try {
        let studentid = document.getElementById("studentid").className
        let thisstudent = await (await fetch(BACKEND_URL + "/API/Student/" + studentid)).json()
        let student_id_label = document.getElementById("student-id-label")
        let student_name_label = document.getElementById("student-name-label")
        let student_class_label = document.getElementById("student-class-label")
        let student_phone_label = document.getElementById("student-phone-label")
        if (thisstudent != null) {
            student_id_label.innerText = thisstudent.Student_ID
            student_name_label.innerText = thisstudent.Student_Name
            student_class_label.innerText = thisstudent.Student_Grade.toString() + "/" + thisstudent.Student_Class.toString()
            student_phone_label.innerText = thisstudent.Student_Phone
        }
    }
    catch (err) {
        console.error(err)
    }

}

async function LOAD_HISTORY() {
    try {
        let studentid = document.getElementById("studentid").className
        let history = await (await fetch(BACKEND_URL + "/API/Lend/" + studentid, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Type: "QUERYLEND_STUDENT",
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
            name_label.innerText = history[i].Book_Name
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
    let student_id_label = document.getElementById("student-id-label").innerText
    let student_name_label = document.getElementById("student-name-label").innerText
    let student_class_label = document.getElementById("student-class-label").innerText
    let student_phone_label = document.getElementById("student-phone-label").innerText
    let inform_card = document.getElementById("inform-card")
    let cl = inform_card.children.length
    for (let i = cl - 1; i >= cl - 4; i--) {
        inform_card.removeChild(inform_card.children[i])
    }

    let listt = [student_id_label, student_name_label, student_class_label, student_phone_label]
    let idd = ["student_id_form", "student_name_form", "student_class_form", "student_phone_form"]
    for (let i = 0; i < 4; i++) {
        let newform = document.createElement("input")
        newform.id = idd[i]
        newform.value = listt[i]
        inform_card.appendChild(newform)
    }


    let op_card = document.getElementById("op-card")
    op_card.removeChild(op_card.children[0])

    let confirm_button = document.createElement("button")
    confirm_button.id = "confirm-button"
    confirm_button.innerText = "ยืนยัน"

    confirm_button.addEventListener("click" , async () => {
        try {
            
            let student_id_form = document.getElementById("student_id_form")
            let student_name_form = document.getElementById("student_name_form")
            let student_id_val = student_id_form.value
            let Actual_id = document.getElementById("studentid").className
            
            let new_name = document.getElementById("student_name_form").value
            let new_phone = document.getElementById("student_phone_form").value
            let gradeclassstring = document.getElementById("student_class_form").value
            let new_grade = ""
            let new_class = ""
            let isgrade = true
            for (let i = 0 ; i < gradeclassstring.length ; i++) {
                if (gradeclassstring[i] == '/') {
                    isgrade = false 
                    continue
                }
                if (isgrade == true)
                    new_grade += gradeclassstring[i]
                else
                    new_class += gradeclassstring[i]
            }
            
                let target_student = await (await fetch(BACKEND_URL + "/API/Student/" + student_id_val)).json()
                if (target_student != null && Actual_id != student_id_val) {
                    let noti_bar = document.getElementById("noti-bar")
                    noti_bar.className = "noti-bar"
                    noti_bar.innerText = "มีนักเรียนรหัส " + student_id_val + " อยู่แล้ว"
                }
                else {
                    
                    let updatelend = (await fetch(BACKEND_URL + "/API/Lend/" + Actual_id , {
                        method : "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            Type: "UpdateStudent",
                            Student_ID: student_id_val,
                            Student_Name: student_name_form.value
                        })
                    }))

                    let update = await (await fetch(BACKEND_URL + "/API/Student/" + Actual_id , {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            Type:"UpdateOne",
                            Student_ID: student_id_val,
                            Student_Name: new_name,
                            Student_Grade: new_grade,
                            Student_Class: new_class,
                            Student_Phone: new_phone
                })
                })).json()
                    
                    window.location.href = "./" + student_id_val
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
        
        let Actual_id = document.getElementById("studentid").className
        let thisstudent = await (await (fetch(BACKEND_URL + "/API/Student/" + Actual_id))).json()
        let cll = inform_card.children.length
        for (let i = cll - 1; i >= cll - 4; i--) {
            inform_card.removeChild(inform_card.children[i])
        }
        let arrr = [thisstudent.Student_ID , thisstudent.Student_Name , thisstudent.Student_Grade.toString() + "/" + thisstudent.Student_Class.toString() , thisstudent.Student_Phone]
        let listtt = ["student-id-label" , "student-name-label" , "student-class-label" , "student-phone-label"]
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
    let Actual_id = document.getElementById("studentid").className
    delete_button.addEventListener ("click" , async () => {
        if (confirm("ยืนยันการลบนักเรียน") == true) {
            let deletee = (await (fetch(BACKEND_URL + "/API/Student/" + Actual_id , {
                method : "DELETE"
            })))
            window.location.href = "../Student" 
        }
    })

    

}


