/*
When the logout button is clicked, clear the token cookie on the website and return to the home page*/
document.getElementById("logout-button").addEventListener("click", () => {
    document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    location.href = "/settings";
});
