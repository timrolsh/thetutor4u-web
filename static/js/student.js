import {getTokenInfo} from "/js/get-user.js";
document.getElementById("welcome").innerHTML += " " + getTokenInfo().name;
const subject_select = document.getElementById("subject_select");

fetch("/api/subjects").then((fetchResponse) => {
    fetchResponse.json().then((subjects)=> {
        for (let a = 0; a < subjects.length; ++a) {
            subject_select.innerHTML += `<option value = "${subjects[a]}">${subjects[a]}</option>`
        }

    })
})