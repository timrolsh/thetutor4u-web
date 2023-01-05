import {getDBInfo} from "/js/get-user.js";
const subject = localStorage.getItem("subject");
const problem_description = localStorage.getItem("problem_description");
const status = document.getElementById("status");

if (subject === null || problem_description === null) {
    window.location.href = "/student";
} else {
    getDBInfo().then((fetchResponse) => {
        fetchResponse.json().then((user) => {
            fetch("/languages.json").then((fetchResponse) => {
                fetchResponse.json().then((allLanguages) => {
                    let languages = "";
                    for (let a = 0; a < user.languages.length; ++a) {
                        for (let b = 0; b < allLanguages.length; ++b) {
                            if (allLanguages[b].code === user.languages[a]) {
                                languages += allLanguages[b].native_name + ", ";
                            }
                        }
                    }
                    languages = languages.substring(0, languages.length - 2);
                    document.getElementById("header").innerHTML =
                        `Welcome, ${user.first_name} ${user.last_name}. You are looking for tutors speaking` +
                        ` the following languages: ${languages} and teaching the following subject: ${subject}.`;
                    setInterval(() => {
                        // request available tutors
                        fetch("/api/active-tutors", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({languages: user.languages, subject: subject})
                        }).then((fetchResponse) => {
                            fetchResponse.json().then((tutors) => {
                                if (tutors.length === 0) {
                                    status.innerHTML =
                                        `No tutors are available to teach your subject right now. This page will` +
                                        ` update as soon as a tutor becomes available.`;
                                } else {
                                    status.innerHTML =
                                        `There are ${tutors.length} tutors available right now. Select one from the ` +
                                        `list below to get started.`;
                                }
                            });
                        });
                    }, 3000);
                });
            });
        });
    });
}
