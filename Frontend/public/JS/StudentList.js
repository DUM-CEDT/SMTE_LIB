import { BACKEND_URL } from "./env.js";

document.addEventListener("DOMContentLoaded", async function () {
    GetAllStudent()
    AddEvent()
});

async function GetAllStudent() {
    let AllStudent = await (await fetch(BACKEND_URL + "/API/Student/", { method: "GET" })).json()

    AllStudent = AllStudent.sort((a, b) => {
        if (a.Student_ID < b.Student_ID)
            return -1
    })

    const wrapper = document.getElementById("wrapper")

    for (let i = 0; i < AllStudent.length; i++) {
        let newblock = document.createElement("div")
        newblock.className = "block"
        let listt = [AllStudent[i].Student_ID, AllStudent[i].Student_Name]
        for (let j = 0; j < 2; j++) {
            let newtextwrap = document.createElement("div")
            newtextwrap.className = "text-wrapper"
            let newlabel = document.createElement("label")
            newlabel.innerText = listt[j]
            newtextwrap.appendChild(newlabel)
            newblock.appendChild(newtextwrap)
        }

        let newtextwrap = document.createElement("div")
        newtextwrap.className = "text-wrapper"
        let newlabel = document.createElement("label")
        newlabel.innerText = AllStudent[i].Student_Grade.toString() + "/" + AllStudent[i].Student_Class.toString()
        newtextwrap.appendChild(newlabel)
        newblock.appendChild(newtextwrap)

        wrapper.appendChild(newblock)

        newblock.addEventListener("click", () => {
            window.location.href = "../Student/" + AllStudent[i].Student_ID;
        })
    }
}

function AddEvent() {
    let add_student_button = document.getElementById("add-student-button")
    add_student_button.addEventListener("click", () => {
        window.location.href = "../Operation/AddStudent";
    })

    let uprank_button = document.getElementById("uprank-button")
    uprank_button.addEventListener("click", async () => {
        let inp = prompt('กรุณาพิมพ์ : "ยืนยันการเลื่อนชั้นปี"  เพื่อดำเนินการต่อ')
        let template = "ยืนยันการเลื่อนชั้นปี"

        if (inp == template) {
            for (let i = 2; i >= 1; i--) {
                let data = {
                    Type: "LevelUpUpdate",
                    FromGrade: i,
                    ToGrade: i + 1
                }

                let LevelUp = await(await fetch(BACKEND_URL + "/API/Student/" + "QUERY", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                })).json()

            }

            let DeleteM3 = await fetch (BACKEND_URL + "/API/Student/" + 'QUERY' , {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Type : "DeleteM3"
                })
            })

            let DeleteM6 = await fetch (BACKEND_URL + "/API/Student/" + 'QUERY' , {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Type : "DeleteM6"
                })
            })

        }
        else if (inp != null) {
            console.log(inp)
            alert("ข้อความไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
        }
    })
}
