let oldResponse;

const searchTutorInterval = setInterval(() => {
    fetch("/api/active-students", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            language: document.getElementById("language").value,
            subject: document.getElementById("subject").value
        })
    }).then((apiResponse) => {
        apiResponse.json().then((currentResponse) => {
            // compare differences between old respone and new response, and then update the dom elements based on that


        })
    });
}, 2000);
