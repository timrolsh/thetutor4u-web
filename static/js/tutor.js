import {getDBInfo} from "get-user";

getDBInfo().then((fetchResponse) => {
    fetchResponse.json().then((user) => {
        document.getElementById("welcome").innerHTML += `${user.first_name} ${user.last_name}`;
        if (user.is_tutor) {
            document.getElementById("valid-tutor").style = "";
            if (user.tutor_bio === null) {
                document.getElementById("no_tutor_bio").style = "";
            }
            if (user.tutor_subjects.length === 0) {
                document.getElementById("no-subjects-teach").style = "";
            } else {
                for (let a = 0; a < user.tutor_subjects.length; ++a) {
                    document.getElementById("select").innerHTML += `<option>${user.tutor_subjects[a]}</option>`;
                }
                document.getElementById("find_students_form").style = "";
            }
        } else {
            document.getElementById("not_a_tutor").style = "";
            document.getElementById("signup_tutor_form").style = "";
        }
    });
});