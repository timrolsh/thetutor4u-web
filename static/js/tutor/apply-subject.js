import {getTokenInfo} from "/js/get-user.js";
document.getElementById("welcome").innerHTML += ` ${getTokenInfo().name}`;

fetch("/api/subjects").then((fetchResponse) => {
    fetchResponse.json().then((subjects) => {
        // if there are no subjects available on the site, offer to create one
        if (subjects.length === 0) {
            document.getElementById("no-subjects").style = "";
        } else {
            for (let a = 0; a < subjects.length; ++a) {
                document.getElementById("select").innerHTML += `<option value = "${subjects[a]}"></option>`;
            }
            document.getElementById("form").style = "";
        }
    });
});
