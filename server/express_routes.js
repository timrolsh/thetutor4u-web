const {server, passport} = require("./express_config");
const rootPath = require("./root_path");
const db = require("./db_pool");

// home page: if user is logged in, bring them to dashboard
server.get("/", (request, response) => {
    if (request.isAuthenticated()) {
        response.redirect("/dashboard");
    } else {
        response.sendFile(`${rootPath}/pages/index.html`);
        response.statusCode = 200;
    }
});
// dashboard page: if user is not logged in, bring them to home page where they can choose how to log in
server.get("/dashboard", (request, response) => {
    if (request.isAuthenticated()) {
        response.render("dashboard");
        response.statusCode = 200;
    } else {
        response.redirect("/");
    }
});

server.get("/settings", (request, response) => {
    if (request.isAuthenticated()) {
        response.render("settings");
        response.statusCode = 200;
    } else {
        response.redirect("/");
    }
});

server.get("/me", (request, response) => {
    if (request.isAuthenticated()) {
        response.send(request.user);
        response.statusCode = 200;
    }
});

/*
Authentication routes
*/

// google authentication routes
server.post("/auth/google/passport", passport.authenticate("google", {failureRedirect: "/"}));

server.get("/auth/google/passport", passport.authenticate("google", {failureRedirect: "/"}), (request, response) => {
    response.redirect("/dashboard");
});

// logout routes for all methods in passport
server.get("/auth/logout-passport", (request, response) => {
    request.logout(() => {
        response.redirect("/");
    });
});


module.exports = server;
