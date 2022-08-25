import {getDBInfo} from "get-user";
const username = document.getElementById("username_field");
const first_name = document.getElementById("first_name_field");
const last_name = document.getElementById("last_name_field");
const email = document.getElementById("email_field");
const dob = document.getElementById("dob_field");
const save_button = document.getElementById("save_button");
const illegalChars = "1234567890_+=[]{}:;|<,>.?/";
const tutor_bio = document.getElementById("tutor_bio_field");
const form = document.getElementById("form");
let username_old;

function isSignedInWithEmail() {
    return email !== null;
}

function changesMade() {
    if (isSignedInWithEmail()) {
        return !(
            username.value === "" &&
            first_name.value === "" &&
            last_name.value === "" &&
            email.value === "" &&
            password_old.value === "" &&
            password_new.value === "" &&
            dob.value === ""
        );
    } else {
        return !(username.value === "" && first_name.value === "" && last_name.value === "" && dob.value === "");
    }
}
/*
Returns whether the name is valid or not. Compares every characacter in the name to the list of illegal characters.
*/
function validName(name) {
    for (var a = 0; a < name.length; ++a) {
        if (illegalChars.indexOf(name[a]) !== -1) {
            return false;
        }
    }
    return true;
}

function validUsername() {
    return fetch("/api/valid-username", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username: username.value})
    });
}

function validDob(user) {
    if (user.dob !== null) {
        return true;
    } else {
        return dob.value !== "";
    }
}

/* 
returns a boolean of whether the form data is valid. Verifies the first name, last name, and username before changing 
the settings
*/
function formDataValid(user) {
    return new Promise((resolve, reject) => {
        if (!(validName(first_name.value) && validName(last_name.value) && validDob(user))) {
            reject(
                `You have entered either a first name or last name using illegal characacters (${illegalChars}), ` +
                    `or you have not specified your DOB. `
            );
        }
        // if username is changing, check that new username provided is valid
        if (username.value === "" || username.value === username_old) {
            resolve();
        } else {
            validUsername().then((response) => {
                response.text().then((response) => {
                    // if username is not a valid username
                    if (response !== "valid") {
                        reject("The username you have provided has already been taken.");
                    } else {
                        resolve();
                    }
                });
            });
        }
    });
}

// form submit handler

getDBInfo().then((fetchResponse) => {
    fetchResponse.json().then((user) => {
        save_button.addEventListener("click", () => {
            formDataValid(user)
                .then(() => {
                    form.submit();
                })
                .catch((error) => {
                    alert(`Unable to save settings for the following reason: ${error}`);
                });
        });

        username_old = user.username;
        document.getElementById("welcome").innerHTML += user.name;
        // select languages user already teaches in the language select box
        const option_fields = document.getElementById("languages_select").children;
        for (let a = 0; a < option_fields.length; ++a) {
            for (let b = 0; b < user.languages.length; ++b) {
                if (option_fields[a].getAttribute("value") === user.languages[b]) {
                    option_fields[a].selected = true;
                    user.languages.splice(b, 1);
                    break;
                }
            }
        }
        // populate all the fields with the data from the user object
        if (user.dob === null) {
            document.getElementById("dob_info_null").style = "";
        } else {
            dob.value = user.dob;
        }
        username.value = user.username;
        first_name.value = user.first_name;
        last_name.value = user.last_name;
        email.value = user.email;
        if (user.is_tutor === true) {
            document.getElementById("tutor_biography").style = "";
            tutor_bio.setAttribute("name", "tutor_bio");
            tutor_bio.setAttribute("type", "text");
            if (user.tutor_bio !== null) {
                tutor_bio.value = user.tutor_bio;
            }
        }
    });
});
