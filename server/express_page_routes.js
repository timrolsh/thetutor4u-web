const server = require("./express_config");
const rootPath = require("./root_path");
const db = require("./db_pool");
const crypto = require("crypto");
const {getUser, googleClient} = require("./user_authentication");

/*
About page, looks the same for everyone no matter if they are logged in or not. Static page
 */
server.get("/about", (_, response) => {
    response.sendFile(`${rootPath}/pages/about.html`);
});

/*
For all protected endpoints: display the page if user is signed in, redirect back to home if they are not singed in.
*/
function processProtectedEndpoint(request, response, redirect) {
    getUser(request, response, (user) => {
        // user is not logged in, go home
        if (user === false) {
            response.redirect("/");
        }
        // user is logged in, render settings page
        else {
            response.sendFile(`${rootPath}/pages/${redirect}.html`);
        }
    });
}
server.get("/settings", (request, response) => {
    processProtectedEndpoint(request, response, "settings");
});
server.get("/student", (request, response) => {
    processProtectedEndpoint(request, response, "student");
});
server.get("/tutor", (request, response) => {
    processProtectedEndpoint(request, response, "tutor");
});
server.get("/calendar", (request, response) => {
    processProtectedEndpoint(request, response, "calendar");
});
server.get("/tutor/apply-subject", (request, response) => {
    processProtectedEndpoint(request, response, "tutor/apply-subject");
});
server.get("/tutor/create-subject", (request, response) => {
    processProtectedEndpoint(request, response, "tutor/create-subject");
});

/*
Home page: If user is signed in, render dashboard. Otherwise, render home page
*/
server.get("/", (request, response) => {
    getUser(request, response, (user) => {
        // user does not exist, render home page
        if (user === false) {
            response.sendFile(`${rootPath}/pages/index.html`);
        }
        // user is signed in, render signed in home page
        else {
            response.sendFile(`${rootPath}/pages/index-signed-in.html`);
        }
    });
});

/*
html form posts to this route when settings are saved
*/
server.post("/settings", (request, response) => {
    function errorCallback(error) {
        console.log(error);
        response.statusCode = 500;
        response.send("database error");
        return;
    }
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
                                    // if tutor bio field was provifed, user is a tutor, update their tutor bio
                                    if (request.body.tutor_bio) {
                                        db.query("update thetutor4u.tutor set biography = $1 where user_id = $2;", [
                                            request.body.tutor_bio,
                                            user.sub
                                        ])
                                            .then(() => {
                                                response.sendFile(`${rootPath}/pages/settings.html`);
                                            })
                                            .catch(errorCallback);
                                    } else {
                                        response.sendFile(`${rootPath}/pages/settings.html`);
                                    }
                                })
                                .catch(errorCallback);
                        })
                        .catch(errorCallback);
                })
                .catch(errorCallback);
        });
    }
});

/*
html form posts to this route when tutor creates a new subject
*/
server.post("/tutor/create-subject", (request, response) => {
    function errorCallback(error) {
        console.log(error);
        response.statusCode = 500;
        response.send("database error");
        return;
    }
    getUser(request, response, (user) => {
        if (user === false) {
            response.redirect("/");
        } else {
            console.log("a");
            if (request.body.subject) {
                db.query("select * from thetutor4u.subject where name = $1;", [request.body.subject]).then(({rows}) => {
                    console.log("b");
                    // if subject does not exist, create a new subject and register tutor to teach that subject
                    if (rows.length === 0) {
                        console.log("c");
                        db.query("insert into thetutor4u.subject (name) values ($1);", [request.body.subject])
                            .then(() => {
                                console.log("d");
                                db.query(
                                    "insert into thetutor4u.subject_tutor (tutor_id, subject_name) values ($1, $2)",
                                    [user.sub, request.body.subject]
                                )
                                    .then(() => {
                                        console.log("e");
                                        response.redirect("/tutor");
                                    })

                                    .catch(errorCallback);
                            })
                            .catch(errorCallback);
                    } else {
                        response.redirect("/tutor");
                    }
                });
            }
        }
    });
});

/*
html form posts to this route when tutor applies for a new subject
*/
server.post("/tutor/apply-subject", (request, response) => {
    function errorCallback(error) {
        console.log(error);
        response.statusCode = 500;
        response.send("database error");
        return;
    }
    getUser(request, response, (user) => {
        if (user === false) {
            response.redirect("/");
        } else {
            if (request.body.subject || request.body.subject !== null) {
                db.query("select name from thetutor4u.subject where name = $1;", [request.body.subject])
                    .then(({rows}) => {
                        if (rows.length === 1) {
                            db.query(
                                "select subject_name from thetutor4u.subject_tutor where tutor_id = $1 and subject_name = $2;",
                                [user.sub, request.body.subject]
                            )
                                .then(({rows}) => {
                                    if (rows.length === 0) {
                                        db.query(
                                            "insert into thetutor4u.subject_tutor (tutor_id, subject_name) values ($1, $2);",
                                            [user.sub, request.body.subject]
                                        )
                                            .then(() => {
                                                response.redirect("/tutor");
                                            })
                                            .catch(errorCallback);
                                    }
                                })
                                .catch(errorCallback);
                        }
                    })
                    .catch(errorCallback);
            } else {
                response.redirect("/tutor");
            }
        }
    });
});

/*
google authentication callback route, google posts back here after it is logged in with jwt which is stored in browser
cookies and validate JWT on every request
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
