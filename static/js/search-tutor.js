let oldResponse;

const searchTutorInterval = setInterval(() => {
    fetch("/api/current-students", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            language: document.getElementById("language").value,
            subject: document.getElementById("subject").value
        })
    }).then();
    // TODO continue from here
}, 2000);
