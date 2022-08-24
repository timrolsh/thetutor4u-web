const username = document.getElementById("username_field");
const first_name = document.getElementById("first_name_field");
const last_name = document.getElementById("last_name_field");
const email = document.getElementById("email_field");
const dob = document.getElementById("dob_field");
const save_button = document.getElementById("save_button");
const illegalChars = "1234567890_+=[]{}:;|<,>.?/";
const updating = document.getElementById("updating_settings");
const tutor_bio = document.getElementById("tutor_bio_field");
const form = document.getElementById("form");
const username_old = username.getAttribute("username_old");
const languages_select = document.getElementById("languages_select");

// get all the languages that the user speaks and check them in the form
fetch("/api/user-languages", {
    credentials: "same-origin",
    method: "GET"
}).then((fetchResonse) => {
    fetchResonse.json().then((languages) => {
        const options = languages_select.children;
        for (let a = 0; a < options.length; ++a) {
            for (let b = 0; b < languages.length; ++b) {
                if (options[a].getAttribute("value") === languages[b]) {
                    options[a].selected = true;
                    languages.splice(b, 1);
                    break;
                }
            }
        }
    });
});

//

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

function validDob() {
    if (dob.getAttribute("dob_exists") === "true") {
        return true;
    } else {
        return dob.value !== "";
    }
}

/* 
returns a boolean of whether the form data is valid. Verifies the first name, last name, and username before changing 
the settings
*/
function formDataValid() {
    return new Promise((resolve, reject) => {
        if (!(validName(first_name.value) && validName(last_name.value) && validDob())) {
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
save_button.addEventListener("click", () => {
    formDataValid()
        .then(() => {
            form.submit();
        })
        .catch((error) => {
            alert(`Unable to save settings for the following reason: ${error}`);
        });
});
