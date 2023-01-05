setInterval(() => {
    fetch("/api/heartbeat", {
        credentials: "same-origin"
    }).catch(() => {
        clearInterval(heartbeatInterval);
    });
}, 3000);
