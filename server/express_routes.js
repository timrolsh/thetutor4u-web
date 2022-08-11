const server = require("./express_config");
const rootPath = require("./root_path");
const db = require("./db_pool");
const Client = require("google-auth-library").OAuth2Client;
const googleClient = new Client(process.env.CLIENT_ID);
const crypto = require("crypto");
const atob = require("atob");

function unixSeconds() {
    return parseInt(Date.now() / 1000);
}

// callbacks to a user json
function getUser(request, response, callback) {
    if (request.cookies.token) {
        const user = JSON.parse(atob(request.cookies.token.split(".")[1]));
        // if token has not expired yet
        if (validTimeToken(user)) {
            // if authenticator provider is google
            if (user.iss === "https://accounts.google.com") {
                googleClient
                    .verifyIdToken({
                        idToken: request.cookies.token,
                        audience: process.env.GOOGLE_CLIENT_ID
                    })
                    .then((response) => {
                        callback(response.getPayload());
                    });
            } else {
                console.log("identity provider is not google");
                callback(user);
            }
        }
        // otherwise token is expired,
        else {
            response.clearCookie("token");
            response.redirect("/");
        }
    } else {
        callback(false);
    }
}

function validTimeToken(userData) {
    return userData === true || unixSeconds() < parseInt(userData.exp);
}

// home page: if user is logged in, bring them to dashboard
server.get("/", (request, response) => {
    getUser(request, response, (user) => {
        if (user === false) {
            response.sendFile(`${rootPath}/pages/index.html`);
            response.statusCode = 200;
        } else {
            response.redirect("/dashboard");
        }
    });
});
// dashboard page: if user is not logged in, bring them to home page where they can choose how to log in
server.get("/dashboard", (request, response) => {
    getUser(request, response, (user) => {
        if (user === false) {
            response.redirect("/");
        } else {
            response.render("dashboard");
            response.statusCode = 200;
        }
    });
});

server.get("/settings", (request, response) => {
    getUser(request, response, (user) => {
        if (user === false) {
            response.redirect("/");
        } else {
            response.render("settings");
            response.statusCode = 200;
        }
    });
});

server.get("/me", (request, response) => {
    getUser(request, response, (user) => {
        if (user === false) {
            response.redirect("/");
        } else {
            response.send(user);
            response.statusCode = 200;
        }
    });
});

/*
Authentication routes
*/

/* google authentication callback route, google posts back here after it is logged in, maybe find a better way of 
doing it as every time the server is restarted the sessions are lost */
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
                        `new user ${user.name}, has been authenticated, but they are not found in database. Inserting new user into database.`
                    );
                    db.query(
                        "insert into thetutor4u.user (id, email, username, first_name, last_name, " +
                            "time_account_created) values ($1, $2, $3, $4, $5, $6);",
                        [user.sub, user.email, crypto.randomUUID(), user.given_name, user.family_name, Date.now()]
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
