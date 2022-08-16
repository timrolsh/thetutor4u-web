/* 
email, password_old, and password_new may be null if the user is signed in with google or another third partry 
identity provider
*/
const username = document.getElementById("username_field");
const first_name = document.getElementById("first_name_field");
const last_name = document.getElementById("last_name_field");
const email = document.getElementById("email_field");
const password_old = document.getElementById("password_old_field");
const password_new = document.getElementById("password_new_field");
const dob = document.getElementById("dob_field");
const button = document.getElementById("save_button");
const illegalChars = "1234567890_+=[]{}:;|<,>.?/";
const updating = document.getElementById("updating_settings");

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
            reject(`You have entered either a first name or last name using illegal characacters (${illegalChars})`);
        }
        // if username is changing, check that new username provided is valid
        if (username.value === "" || username.value === username.placeholder) {
            resolve();
        } else {
            validUsername().then((response) => {
                return response.text().then((response) => {
                    // if username is not a valid username
                    if (response !== "valid") {
                        reject("The username you have provided has already been taken");
                    } else {
                        resolve();
                    }
                });
            });
        }
    });
}

// form submit handler
button.addEventListener("click", () => {
    formDataValid()
        .then(() => {
            updating.style.visibility = "visible";
            const bodyPayload = {
                username: username.value,
                first_name: first_name.value,
                last_name: last_name.value,
                email: email.value,
                dob: dob.value
            };

            if (bodyPayload["username"] === "") {
                bodyPayload["username"] = username.placeholder;
            }
            if (bodyPayload["first_name"] === "") {
                bodyPayload["first_name"] = first_name.placeholder;
            }
            if (bodyPayload["last_name"] === "") {
                bodyPayload["last_name"] = last_name.placeholder;
            }
            if (bodyPayload["email"] === "") {
                bodyPayload["email"] = email.placeholder;
            }
            if (bodyPayload["dob"] === "") {
                bodyPayload["dob"] = dob.placeholder;
            }
            fetch("/api/update-settings", {
                credentials: "same-origin",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyPayload)
            })
                .then(() => {
                    updating.style.visibility = "hidden";
                    if (username.value !== "") {
                        username.placeholder = username.value;
                    }
                    if (first_name.value !== "") {
                        first_name.placeholder = first_name.value;
                    }
                    if (last_name.value !== "") {
                        last_name.placeholder = last_name.value;
                    }
                    if (email.value !== "") {
                        email.placeholder = email.value;
                    }
                    if (dob.value !== "") {
                        dob.placeholder = dob.value;
                    }
                })
                .catch(() => {
                    updating.innerHTML = "Unable to update settings.";
                });
        })
        .catch((error) => {
            alert(`Unable to save settings for the following reason: ${error}`);
        });
});
