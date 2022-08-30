import {getDBInfo} from "/js/get-user.js";
const rates_form = document.getElementById("rates_form");
const find_students_form = document.getElementById("find_students_form");
const rates_form_middle = document.getElementById("rates_form_middle");
const find_students_button = document.getElementById("find_students_button");

document.getElementById("continue_button").addEventListener("click", () => {
    rates_form_middle.innerHTML = "";
    // get all the selected options
    let allOptions = document.getElementById("select_subjects").options;
    let subjects = [];
    let total = 0;
    for (let a = 0; a < allOptions.length; ++a) {
        if (allOptions[a].selected === true) {
            subjects.push(allOptions[a].value);
            rates_form_middle.innerHTML += `
            <div>${allOptions[a].value}</div>
            <input id = "rate-${total}" type = "number" step="0.01" placeholder = "Hourly rate for ${allOptions[a].value}" />
            `;
            ++total;
        }
    }
    document.getElementById("back_button").addEventListener("click", () => {
        console.log("a");
        rates_form.setAttribute("style", "display: none;");
        find_students_form.removeAttribute("style");
    });
    find_students_form.setAttribute("style", "display: none;");
    rates_form.removeAttribute("style");

    find_students_button.addEventListener("click", () => {
        let success = true;
        let final = [];
        for (let a = 0; a < subjects.length; ++a) {
            let hourly_rate = parseFloat(document.getElementById(`rate-${a}`).value);
            if (hourly_rate === null || hourly_rate < 0) {
                alert("make sure you have filled all of your hourly rates and that none of the rates are less than 0.");
                success = false;
                break;
            }
            final.push({subject: subjects[a], hourly_rate: hourly_rate});
        }
        if (success) {
            localStorage.clear();
            localStorage.setItem("subject_rates_json", JSON.stringify(final));
            window.location.href = "/search/find-student";
        }
    });
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
