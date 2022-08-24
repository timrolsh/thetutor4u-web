const server = require("./express_config");
const rootPath = require("./root_path");
const db = require("./db_pool");
const crypto = require("crypto");
const {getUser, googleClient, getFullUserInfo} = require("./user_authentication");

/* 
home page: if user is logged in, bring them to dashboard, otherwise, render the home page
*/
server.get("/", (request, response) => {
    getUser(request, response, (user) => {
        // user does not exist, render home page
        if (user === false) {
            response.sendFile(`${rootPath}/pages/index.html`);
        }
        // user is signed in, render signed in home page
        else {
            getFullUserInfo(user).then((userInfo) => {
                response.render("index-signed-in", userInfo);
            });
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
        // user is logged in, render settings page
        else {
            getFullUserInfo(user).then((userInfo) => {
                response.render("settings", userInfo);
            });
        }
    });
});

/*
Also settings page but for when settings are saved and form is submitted
*/
server.post("/settings", (request, response) => {
    if (
        !(
            request.body.username &&
            request.body.first_name &&
            request.body.last_name &&
            request.body.email &&
            request.body.dob &&
            request.body.languages_spoken
        )
    ) {
        response.statusCode = 400;
        response.send("Not all data fields have been supplied");
    } else {
        getUser(request, response, (user) => {
            db.query(
                "update thetutor4u.user set username = $1, first_name = $2, last_name = $3, email = $4, dob = $5" +
                    " where id = $6;",
                [
                    request.body.username,
                    request.body.first_name,
                    request.body.last_name,
                    request.body.email,
                    request.body.dob,
                    user.sub
                ]
            )
                .then(() => {
                    // update user's languages spoken
                    db.query("delete from thetutor4u.language_user where user_id = $1;", [user.sub])
                        .then(() => {
                            const languages_spoken = request.body["languages_spoken"];
                            let valuesString = "";
                            // if it is an array
                            if (Array.isArray(languages_spoken)) {
                                // with commas
                                for (let a = 0; a < languages_spoken.length - 1; ++a) {
                                    valuesString += `('${user.sub}', '${languages_spoken[a]}'),`;
                                }
                                // without comma, final one
                                valuesString += `('${user.sub}', '${languages_spoken[languages_spoken.length - 1]}')`;
                            } else {
                                // one thing, its a string
                                valuesString = `('${user.sub}', '${languages_spoken}')`;
                            }
                            db.query(
                                `insert into thetutor4u.language_user (user_id, language_code) values ${valuesString};`
                            )
                                .then(() => {
                                    getFullUserInfo(user).then((userInfo) => {
                                        response.render("settings", userInfo);
                                    });
                                })
                                .catch(() => {
                                    response.statusCode = 500;
                                    response.send("database issue");
                                });
                        })
                        .catch(() => {
                            response.statusCode = 500;
                            response.send("database issue");
                        });
                })
                .catch(() => {
                    response.statusCode = 500;
                    response.send("database issue");
                });
        });
    }
});

/*
About page, looks the same for everyone no matter if they are logged in or not
 */
server.get("/about", (request, response) => {
    response.sendFile(`${rootPath}/pages/about.html`);
});

/*
Student dashboard page: if user is not logged in, bring them to home page
*/
server.get("/student", (request, response) => {
    getUser(request, response, (user) => {
        // user is not logged in, go home
        if (user === false) {
            response.redirect("/");
        }
        // user is logged in, render student dashboard page
        else {
            getFullUserInfo(user).then((userInfo) => {
                response.render("student", userInfo);
            });
        }
    });
});

/*
Tutor dashboard page: if user is not logged in, bring them to home page
*/
server.get("/tutor", (request, response) => {
    getUser(request, response, (user) => {
        // user is not logged in, go home
        if (user === false) {
            response.redirect("/");
        }
        // user is logged in, render tutor dashboard page
        else {
            getFullUserInfo(user).then((userInfo) => {
                response.render("tutor", userInfo);
            });
        }
    });
});

/*
Calendar page: if user is not logged in, bring them to home page
*/
server.get("/calendar", (request, response) => {
    getUser(request, response, (user) => {
        // user is not logged in, go home
        if (user === false) {
            response.redirect("/");
        }
        // user is logged in, render student dashboard page
        else {
            getFullUserInfo(user).then((userInfo) => {
                response.render("calendar", userInfo);
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
Search page for both students and tutors to connect
*/
server.post("/search", (request, response) => {
    // if not all the fields are provided or the context isn't correct, bring back to home page
    if (
        !(
            request.body.context &&
            request.body.language &&
            request.body.subject &&
            (request.body.context === "student" || request.body.context === "tutor")
        )
    ) {
        response.redirect("/");
    } else {
        getUser(request, response, (user) => {
            if (user === false) {
                response.redirect("/");
            } else {
                getFullUserInfo(user).then((userInfo) => {
                    // student is looking for one subject, add that into their user field
                    if (request.body.context === "student") {
                        db.query("update thetutor4u.user set subject_name = $1 where id = $2;", [
                            request.body.subject,
                            user.sub
                        ]);
                    }
                    // tutor is looking to teach multiple subjects, set all of the teaching_now properties to false first and then set all the teaching_now properties to true for all of the subjects that the tutor has selected to teach
                    else {
                    }
                    userInfo.context = request.body.context;
                    userInfo.subject = request.body.subject;
                    userInfo.language = request.body.language;
                    response.render("search", userInfo);
                });
            }
        });
    }
});

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
                        console.log(`Adding default spoken language for new user ${user.name} English.`);
                        db.query("insert into thetutor4u.language_user (language_code, user_id) values ($1, $2);", [
                            "en",
                            user.sub
                        ]).then(() => {
                            console.log("Fully added new user to database, redirecting them back to home");
                            response.redirect("/");
                        });
                    });
                } else {
                    console.log(`found user ${user.name} in database, not adding.`);
                    response.redirect("/");
                }
            });
        });
});

module.exports = server;
