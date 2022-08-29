// check that username is unique and that all of the fields are filled out before the form is submitted
const username = document.getElementById("username_field");
const password = document.getElementById("password_field");
const confirm_password = document.getElementById("confirm_password_field");
const first_name = document.getElementById("first_name_field");
const last_name = document.getElementById("last_name_field");
const email = document.getElementById("email_field");
const dob = document.getElementById("dob_field");
const form = document.getElementById("form");

function verifyAllFieldsFilledOut() {
    return !(
        username.value === "" ||
        password.value === "" ||
        first_name.value === "" ||
        last_name.value === "" ||
        email.value === "" ||
        dob.value === ""
    );
}

function verifyPasswordsMatch() {
    return password.value === confirm_password.value;
}

document.getElementById("button").addEventListener("click", () => {
    if (verifyAllFieldsFilledOut()) {
        if (!verifyPasswordsMatch()) {
            alert("Unable to register for an account: Password fields do not match.");
        } else {
            fetch("/api/valid-username", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username: username.value})
            }).then((fetchResponse) => {
                fetchResponse.text().then((response) => {
                    if (response === "valid") {
                        form.submit();
                    } else {
                        alert(
                            "Unable to register for an account: The username that you have provided has already been taken."
                        );
                    }
                });
            });
        }
    } else {
        alert("Unable to register for an account: You have not filled out all of the required fields.");
    }
});
