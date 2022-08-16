const server = require("./express_config");
const rootPath = require("./root_path");
const db = require("./db_pool");
const crypto = require("crypto");
const {getUser, googleClient, getFullUserInfo} = require("./user_authentication");

/* 
home page: if user is logged in, bring them to dashboard, otherwise, render the dashboard
*/
server.get("/", (request, response) => {
    getUser(request, response, (user) => {
        // user does not exist, render home page
        if (user === false) {
            response.sendFile(`${rootPath}/pages/index.html`);
        }
        // user exists, go to dashboard
        else {
            response.redirect("/dashboard");
        }
    });
});

/*
dashboard page: if user is not logged in, bring them to home page
*/
server.get("/dashboard", (request, response) => {
    getUser(request, response, (user) => {
        // user is not logged in, go home
        if (user === false) {
            response.redirect("/");
        }
        // user is loggedd in, render dashboard
        else {
            response.render("dashboard", user);
        }
    });
});

/*
settings page: if user is not logged in, bring them to home page
*/
server.get("/settings", (request, response) => {
    getUser(request, response, (user) => {
        // user is not logged in, go home
        if (user === false) {
            response.redirect("/");
        }
        // user is loggedd in, render settings page
        else {
            getFullUserInfo(user).then((userInfo) => {
                response.render("settings", userInfo);
            });
        }
    });
});

/*
route that displays user info: for development purposes only and will not be active during production
*/
if (process.env.DEV === "true") {
    server.get("/auth/me", (request, response) => {
        getUser(request, response, (user) => {
            if (user === false) {
                response.redirect("/");
            } else {
                getFullUserInfo(user).then((userInfo) => {
                    response.send(userInfo);
                });
            }
        });
    });
}

/*
google authentication callback route, google posts back here after it is logged in with jwt, we store that jwt in 
browser cookies and validate JWT on every request
*/
server.post("/auth/google/callback", (request, response) => {
    response.clearCookie("token");
    googleClient
        .verifyIdToken({
            idToken: request.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        .then((user) => {
            user = user.getPayload();
            response.cookie("token", request.body.credential);
            db.query("select * from thetutor4u.user where id = $1;", [user.sub]).then((dbResponse) => {
                console.log(`made query for user ${user.name}`);
                // if user does not exist in the database, add a new entry for them
                if (dbResponse.rows.length === 0) {
                    console.log(
                        `new user ${user.name}, has been authenticated, but they are not found in database. ` +
                            `Inserting new user into database.`
                    );
                    db.query(
                        "insert into thetutor4u.user (id, email, username, first_name, last_name, " +
                            "time_account_created, iss) values ($1, $2, $3, $4, $5, $6, $7);",
                        [
                            user.sub,
                            user.email,
                            crypto.randomUUID(),
                            user.given_name,
                            user.family_name,
                            parseInt(Date.now() / 1000),
                            user.iss
                        ]
                    ).then(() => {
                        console.log(`inserted new user ${user.name}`);
                        return;
                    });
                } else {
                    console.log(`found user ${user.name}`);
                }
                response.redirect("/dashboard");
            });
        });
});

module.exports = server;
