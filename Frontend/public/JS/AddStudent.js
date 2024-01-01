import { BACKEND_URL } from "./env.js";

document.addEventListener("DOMContentLoaded" , () => {
    AddEvent()
})

function AddEvent() {
    let submit_button = document.getElementById("submit-button")
    let error_container = document.getElementById("error-container")

    submit_button.addEventListener("click" , async () => {
    let studentid = document.getElementById("Student-ID").value
    let studentname = document.getElementById("Student-Name").value
    let studentgrade = document.getElementById("Student-Grade").value
    let studentclass = document.getElementById("Student-Class").value
    let studentphone = document.getElementById("Student-Phone").value
    
    let thisstudent = await(await fetch(BACKEND_URL + "/API/Student/" + studentid)).json()
    
    while (error_container.childNodes.length != 0) {
        error_container.removeChild(error_container.children[0])
    }

    if (thisstudent != null) {
        let error_box = document.createElement("div")
        error_box.className = "error-box"
        let error_label = document.createElement("label")
        error_label.innerText = ("มีนักเรียนรหัส " + studentid + " อยู่แล้ว")
        error_box.appendChild(error_label)
        error_container.appendChild(error_box)
    }
    else {
        let addstudent = (await fetch(BACKEND_URL + "/API/Student/" , {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Type:"UpdateOne",
                Student_ID : studentid ,
                Student_Name : studentname,
                Student_Grade : studentgrade,
                Student_Class : studentclass,
                Student_Phone : studentphone,
            })
        }))

        if (addstudent.status == 201) {
            let error_box = document.createElement("div")
            error_box.className = "success-box"
            let error_label = document.createElement("label")
            error_label.innerText = ("เพิ่มนักเรียนรหัส  " + studentid + " สำเร็จ")
            error_box.appendChild(error_label)
            error_container.appendChild(error_box)

            document.getElementById("Student-ID").value = ""
            document.getElementById("Student-Name").value = ""
            document.getElementById("Student-Grade").value = ""
            document.getElementById("Student-Class").value = ""
            document.getElementById("Student-Name").value = ""
            document.getElementById("Student-Phone").value = ""
            



        }
    }
    })
}