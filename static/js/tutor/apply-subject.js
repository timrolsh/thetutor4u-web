import {getDBInfo} from "/js/get-user.js";

getDBInfo().then((fetchResponse) => {
    fetchResponse.json().then((user) => {
        console.log(user);

        document.getElementById("welcome").innerHTML += ` ${user.first_name} ${user.last_name}`;
        fetch("/api/subjects").then((fetchResponse) => {
            fetchResponse.json().then((subjects) => {
                console.log(subjects);
                // if there are no subjects available on the site, offer to create one
                if (subjects.length === 0) {
                    document.getElementById("no-subjects").style = "";
                } else {
                    for (let a = 0; a < subjects.length; ++a) {
                        let tutorTeachesSubjectAlready = false;
                        for (let b = 0; b < user["tutor_subjects"].length; ++b) {
                            if (subjects[a] === user["tutor_subjects"][b]) {
                                tutorTeachesSubjectAlready = true;
                                break;
                            }
                        }
                        if (!tutorTeachesSubjectAlready) {
                            document.getElementById(
                                "select"
                            ).innerHTML += `<option value = "${subjects[a]}">${subjects[a]}</option>`;
                        }
                    }
                    document.getElementById("form").style = "";
                }
            });
        });
    });
});
