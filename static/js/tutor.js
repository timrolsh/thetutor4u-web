import {getDBInfo} from "/js/get-user.js";
const rates_form = document.getElementById("rates_form");
const find_students_form = document.getElementById("find_students_form");
const rates_form_middle = document.getElementById("rates_form_middle");

document.getElementById("find_students_button").addEventListener("click", () => {
    rates_form_middle.innerHTML = "";
    // get all the selected options
    let allOptions = document.getElementById("select_subjects").options;
    for (let a = 0; a < allOptions.length; ++a) {
        if (allOptions[a].selected === true) {
            rates_form_middle.innerHTML += `
            <div>${allOptions[a].value}</div>
            <input type = "number" step="0.01" name = "${allOptions[a].value}" placeholder = "Hourly rate for ${allOptions[a].value}" />
            `;
        }
    }
    document.getElementById("back_button").addEventListener("click", () => {
        console.log("a");
        rates_form.setAttribute("style", "display: none;");
        find_students_form.removeAttribute("style");
    });
    find_students_form.setAttribute("style", "display: none;");
    rates_form.removeAttribute("style");

    // create a form to specify proces for each subject
    // make form visible
});

getDBInfo().then((fetchResponse) => {
    fetchResponse.json().then((user) => {
        document.getElementById("welcome").innerHTML += ` ${user.first_name} ${user.last_name}`;
        if (user.is_tutor) {
            document.getElementById("tutor_links").style = "";
            document.getElementById("valid-tutor").style = "";
            if (user.tutor_bio === null) {
                document.getElementById("no_tutor_bio").style = "";
            }
            if (user.tutor_subjects.length === 0) {
                document.getElementById("no-subjects-teach").style = "";
            } else {
                for (let a = 0; a < user.tutor_subjects.length; ++a) {
                    document.getElementById(
                        "select_subjects"
                    ).innerHTML += `<option>${user.tutor_subjects[a]}</option>`;
                }
                find_students_form.style = "";
            }
        } else {
            document.getElementById("not_a_tutor").style = "";
            document.getElementById("signup_tutor_form").style = "";
        }
    });
});
