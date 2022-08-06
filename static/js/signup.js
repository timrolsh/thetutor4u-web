const form = document.getElementById("signup_form");
const button = document.getElementById("submit_button");

/* 
formData is an object that looks like this
{
    dob_day: string;
    dob_month: string;
    dob_year: string;
    first_name: string;
    last_name: string;
    username: string;
}
*/
function validateData(formData) {
    // TODO implement this
    return true;
}

button.addEventListener("click", () => {
    const formData = Object.fromEntries(new FormData(form).entries());
    if (validateData(formData)) {
        form.submit();
    } else {
        alert("The form has been submitted incorrectly, verify that all the fields are in the correct format. ");
    }
});
