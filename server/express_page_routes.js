const server = require("./express_config");
const rootPath = require("./root_path");
const db = require("./db_pool");
const crypto = require("crypto");
const {getUser, googleClient} = require("./user_authentication");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const privateKey = fs.readFileSync(`${rootPath}/authentication/jwtRS256.key`);

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
            if (request.body.subject) {
                db.query("select * from thetutor4u.subject where name = $1;", [request.body.subject]).then(({rows}) => {
                    // if subject does not exist, create a new subject and register tutor to teach that subject
                    if (rows.length === 0) {
                        db.query("insert into thetutor4u.subject (name) values ($1);", [request.body.subject])
                            .then(() => {
                                db.query(
                                    "insert into thetutor4u.subject_tutor (tutor_id, subject_name) values ($1, $2)",
                                    [user.sub, request.body.subject]
                                )
                                    .then(() => {
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
                // if user does not exist in the database, add a new entry for them
                if (dbResponse.rows.length === 0) {
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
                        db.query("insert into thetutor4u.language_user (language_code, user_id) values ($1, $2);", [
                            "en",
                            user.sub
                        ]).then(() => {
                            response.redirect("/");
                        });
                    });
                } else {
                    response.redirect("/");
                }
            });
        });
});

server.post("/search/find-tutor", (request, response) => {
    // verify that a subject was provided
    if (!request.body.subject) {
        response.redirect("/student");
    } else {
        getUser(request, response, (user) => {
            if (user === false) {
                response.redirect("/");
            } else {
                response.cookie("subject", request.body.subject);
                response.sendFile(`${rootPath}/pages/search/find-tutor.html`);
            }
        });
    }
});
server.post("/search/find-student", (request, response) => {
    getUser(request, response, (user) => {
        if (user === false) {
            response.redirect("/");
        } else {
            response.sendFile(`${rootPath}/pages/search/find-tutor.html`);
        }
    });
});

server.post("/tutor/apply-subject", (request, response) => {
    function errorCallback(error) {
        console.log(error);
        response.statusCode = 500;
        response.send("database error");
        return;
    }
    if (request.body.subject) {
        getUser(request, response, (user) => {
            if (user === false) {
                response.redirect("/");
            } else {
                // verify that user is a tutor, verify that the tutor does not already teach this subject, then insert the new subject tutor
                db.query("select * from thetutor4u.tutor where user_id = $1;", [user.sub])
                    .then(({rows}) => {
                        // user is a tutor
                        if (rows.length !== 0) {
                            db.query(
                                "select * from thetutor4u.subject_tutor where subject_name = $1 and tutor_id = $2;",
                                [request.body.subject]
                            )
                                .then(({rows}) => {
                                    // tutor doesn't teach this subject already
                                    if (rows.length === 0) {
                                        db.query(
                                            "insert into thetutor4u.subject_tutor (subject_name, tutor_id) values ($1, $2);",
                                            [request.body.subject, user.sub]
                                        )
                                            .then(() => {
                                                response.redirect("/tutor");
                                            })
                                            .catch(errorCallback);
                                    } else {
                                        response.redirect("/tutor");
                                    }
                                })
                                .catch(errorCallback);
                        }
                        // user is not a tutor
                        else {
                            response.redirect("/");
                        }
                    })
                    .catch(errorCallback);
            }
        });
    } else {
        response.redirect("/");
    }
});

server.get("/signup", (request, response) => {
    // TODO implement this later
    getUser(request, response, (user) => {
        if (user === false) {
            response.sendFile(`${rootPath}/pages/authentication/signup-email.html`);
        } else {
            response.redirect("/");
        }
    });
});

server.post("/signup", (request, response) => {
    // verify that all of the fields exists in the request
    if (
        !(
            request.body.usernmame &&
            request.body.password &&
            request.body &&
            request.body.first_name &&
            request.body.last_name &&
            request.body.email &&
            request.body.dob
        )
    ) {
        response.statusCode = 400;
        response.send("Not all of the proper fields have been supplied.");
    } else {
        getUser(request, response, (user) => {
            // verify that user is not logged in
            if (user !== false) {
                response.redirect("/");
            } else {
                // verify that the username has not been taken
                db.query("select * from thetutor4u.user where username = $1;", [request.body.username]).then(
                    ({rows}) => {
                        if (rows.length !== 0) {
                            response.statusCode = 400;
                            response.send("The username you have provided has already been taken.");
                        } else {
                            // insert into user
                            db.query("insert into thetutor4u.user ()");
                            // redirect them to their new dashboard page
                        }
                    }
                );
            }
        });
    }
});
module.exports = server;
