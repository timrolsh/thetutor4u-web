import {getTokenInfo} from "/js/get-user.js";
document.getElementById("welcome").innerHTML += " " + getTokenInfo().name;
const subject_select = document.getElementById("subject_select");
const problem_description = document.getElementById("problem_description");

fetch("/api/subjects").then((fetchResponse) => {
    fetchResponse.json().then((subjects) => {
        for (let a = 0; a < subjects.length; ++a) {
            subject_select.innerHTML += `<option value = "${subjects[a]}">${subjects[a]}</option>`;
        }
    });
});

document.getElementById("find_tutors_button").addEventListener("click", () => {
    if (problem_description.value === "" || subject_select.value === "") {
        alert(
            "Please make sure you select a subject and write a short problem description before you look for tutors."
        );
    } else {
        localStorage.clear();
        localStorage.setItem("problem_description", problem_description.value);
        localStorage.setItem("subject", subject_select.value);
        window.location.href = "/search/find-tutor";
    }
});
