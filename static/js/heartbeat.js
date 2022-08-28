const heartbeatInterval = setInterval(() => {
    fetch("/api/heartbeat", {
        credentials: "same-origin"
    }).catch(() => {
        clearInterval(heartbeatInterval);
    });
}, 2000);
