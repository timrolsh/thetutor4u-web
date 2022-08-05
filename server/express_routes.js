const server = require("./express_config");
const rootPath = require("./root_path");
const checkUser = require("./check_user");

server.get("/", (request, response) => {
    checkUser(request, response, "index", () => {
        response.sendFile(`${rootPath}/pages/index.html`);
    })
});

server.get("/dashboard", (request, response) => {
    checkUser(request, response, "dashboard", () => {
        response.render("dashboard", request.oidc.user);
    });
});

server.get("/signup", (request, response) => {
    checkUser(request, response, "signup", () => {
        response.sendFile(`${rootPath}/pages/signup.html`);
    });
});
module.exports = server;
