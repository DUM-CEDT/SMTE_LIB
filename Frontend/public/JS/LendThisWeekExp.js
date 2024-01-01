import { BACKEND_URL } from "./env.js";

document.addEventListener("DOMContentLoaded", () => {
    FillHeader1()
    FillTabel()
})

async function FillHeader1() {
    let month = {
        1: "มกราคม",
        2: "กุมภาพันธ์",
        3: "มีนาคม",
        4: "เมษายน",
        5: "พฤษภาคม",
        6: "มิถุนายน",
        7: "กรกฎาคม",
        8: "สิงหาคม",
        9: "กันยายน",
        10: "ตุลาคม",
        11: "พฤศจิกายน",
        12: "ธันวาคม"
    }

    let today = new Date()
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

    document.getElementById("week-start-date-label").innerText = weekstartdate
    document.getElementById("week-start-month-label").innerText = month[weekstartmonth]
    document.getElementById("week-start-year-label").innerText = weekstartyear

    document.getElementById("date-label").innerText = thisdate
    document.getElementById("month-label").innerText = month[thismonth]
    document.getElementById("year-label").innerText = thisyear

}

async function FillTabel() {
    let today = new Date()
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

    let history = []

    for (let i = 0; i < datprevmonth.length; i++) {
        history.push(datprevmonth[i])
    }

    for (let i = 0; i < datthismonth.length; i++) {
        history.push(datthismonth[i])
    }

    FillTabel1(history)
    FillTabel2(history)
    FillTabel3(history)
}


async function FillTabel1(history) {
    let tabel = document.getElementById("by-grade-tabel")

    let groupclass = {}
    for (let i = 1; i <= 6; i++) {
        groupclass[i] = 0
    }

    let otheruser = 0

    for (let i = 0; i < history.length; i++) {
        let thisstudentid = history[i].Student_ID
        let thisstudentdata = await (await fetch(BACKEND_URL + "/API/Student/" + thisstudentid)).json()
        
        if (thisstudentdata == null) {
            otheruser++
            continue
        }
        
        let thisstudentgrade = thisstudentdata.Student_Grade
        if (groupclass[thisstudentgrade] == null)
            groupclass[thisstudentgrade] = 0
        groupclass[thisstudentgrade]++

    }

    
    let sum = 0
    for (const key in groupclass) {
        if (!(key >= 1 && key <= 6))
            otheruser++
    }

    for (let i = 1; i <= 8; i++) {
        let newrow = document.createElement("tr")
        let leftdata = document.createElement("td")
        let rightdata = document.createElement("td")
        if (i < 7) {
            leftdata.innerText = "ม. " + i
            rightdata.innerText = groupclass[i] + " ครั้ง"
            sum += groupclass[i]
        }
        if (i == 7) {
            leftdata.innerText = "อื่นๆ"
            rightdata.innerText = otheruser + " ครั้ง"
            sum += otheruser
        }
        if (i == 8) {
            leftdata.innerText = "รวม"
            rightdata.innerText = sum + " ครั้ง"
            newrow.style.backgroundColor = "rgb(252, 203, 203)"
        }
        newrow.appendChild(leftdata)
        newrow.appendChild(rightdata)
        tabel.appendChild(newrow)
    }


}

async function FillTabel2(history) {
    let tabel = document.getElementById("by-subject-tabel")

    let subjectgroup = {}

    for (let i = 0; i < history.length; i++) {
        let thisbookid = history[i].Book_ID
        let thisbookdata = await (await fetch(BACKEND_URL + "/API/Book/" + thisbookid)).json()
        let thisbooksub = thisbookdata.Book_Type

        if (subjectgroup[thisbooksub] == null)
            subjectgroup[thisbooksub] = 0
        subjectgroup[thisbooksub]++
    }

    let subjectgroupsort = []

    for (let key in subjectgroup) {
        subjectgroupsort.push({ keyy: key, value: subjectgroup[key] })
    }

    subjectgroupsort.sort((a, b) => {
        if (a.value > b.value)
            return -1
        else if (a.value == b.value) {
            if (a.keyy < b.keyy)
                return -1
        }
    })

    for (let i = 1; i <= 3; i++) {
        let arr = []
        if (i - 1 >= subjectgroupsort.length) {
            arr = [i + ".", "-", "-"]
        }
        else {
            let thissub = subjectgroupsort[i - 1].keyy
            let thissublend = subjectgroupsort[i - 1].value
            arr = [i + ".", thissub, thissublend + " ครั้ง"]
        }
        let newrow = document.createElement("tr")
        for (let j = 0; j < 3; j++) {
            let newdata = document.createElement("td")
            if (arr[j] != null)
                newdata.innerText = arr[j]
            newrow.appendChild(newdata)
        }

        tabel.appendChild(newrow)
    }
}

async function FillTabel3(history) {
    let tabel = document.getElementById("top-lender-tabel")

    let lendergroup = {}

    for (let i = 0; i < history.length; i++) {
        let thisstudent = history[i].Student_Name
        if (lendergroup[thisstudent] == null)
            lendergroup[thisstudent] = 0
        lendergroup[thisstudent]++
    }

    let lendergroupsort = []

    for (let key in lendergroup) {
        lendergroupsort.push({ keyy: key, value: lendergroup[key] })
    }

    lendergroupsort.sort((a, b) => {
        if (a.value > b.value)
            return -1
        else if (a.value == b.value) {
            if (a.keyy < b.keyy)
                return -1
        }
    })

    for (let i = 1; i <= 3; i++) {
        let arr = []
        if (i - 1 >= lendergroupsort.length) {
            arr = [i + ".", "-", "-"]
        }
        else {
            let thissub = lendergroupsort[i - 1].keyy
            let thissublend = lendergroupsort[i - 1].value
            arr = [i + ".", thissub, thissublend + " ครั้ง"]
        }
        let newrow = document.createElement("tr")
        for (let j = 0; j < 3; j++) {
            let newdata = document.createElement("td")
            if (arr[j] != null)
                newdata.innerText = arr[j]
            newrow.appendChild(newdata)
        }

        tabel.appendChild(newrow)
    }
}