const server = require("./express_page_routes");
const db = require("./db_pool");
const {getUser, getFullUserInfo} = require("./user_authentication");

/*
route that checks if a username is valid or not, meaning whether it exists or not. Responds "valid" or "invalid" with 
status code 200
*/
server.post("/api/valid-username", (request, response) => {
    // username is not provided
    if (!request.body.username) {
        response.statusCode = 400;
        response.send(
            "Invalid username provided. The request body should contain the username. You sent the object " +
                JSON.stringify(request.body)
        );
    } else {
        db.query("select * from thetutor4u.user where username = $1;", [request.body.username])
            .then((dbResponse) => {
                response.statusCode = 200;
                // if username does not exist
                if (dbResponse.rows.length === 0) {
                    response.send("valid");
                }
                // username does exist
                else {
                    response.send("invalid");
                }
            })
            .catch(() => {
                response.statusCode = 500;
                response.send("database issue");
            });
    }
});

/*
Temporary sign up route for tutors, will be used only for demo purposes
TODO change this to post route for /tutor
*/
server.post("/api/register-tutor", (request, response) => {
    getUser(request, response, (user) => {
        // user is not logged in, go home
        if (user === false) {
            response.redirect("/");
        }
        // user is logged in, register them as a tutor and bring them back to their tutor dashboard
        getFullUserInfo(user).then((userInfo) => {
            // user is already counted as a tutor in the database
            if (userInfo.is_tutor === true) {
                response.redirect("/tutor");
            } else {
                db.query("insert into thetutor4u.tutor (user_id) values ($1);", [userInfo.dbInfo.id])
                    .then(() => {
                        console.log(
                            `successfully registered new tutor ${userInfo.dbInfo.first_name} ` +
                                userInfo.dbInfo.last_name
                        );
                        // for now register the tutor as being able to teach the demo subject and the demo language
                        db.query("insert into thetutor4u.subject_tutor (tutor_id, subject_name) values ($1, $2)", [
                            user.sub,
                            0
                        ])
                            .then(() => {
                                console.log("registered tutor for demo subject. ");
                                response.redirect("/tutor");
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    });
});

/*
Heartbeat route, client sends requests here and then database gets updated with current time as last_online in unix 
time seconds. If someone is offline for more than 3 seconds, they are now considered offline
*/
server.get("/api/heartbeat", (request, response) => {
    getUser(request, response, (user) => {
        if (user === false) {
            response.statusCode = 400;
            response.send("Log in to access this endpoint. ");
        } else {
            db.query("update thetutor4u.user set last_online = $1 where id = $2;", [
                parseInt(Date.now() / 1000),
                user.sub
            ])
                .catch(() => {
                    response.statusCode = 500;
                    response.send("DB Error");
                })
                .then(() => {
                    response.statusCode = 200;
                    response.send("OK");
                });
        }
    });
});

/*
Will make this route work with multiple languages in the future
*/
server.post("/api/active-students", (request, response) => {
    // TODO maybe make the language field an array of languages and then do an or in the sql clause
    if (!(request.body.subject && request.body.language)) {
        response.statusCode = 400;
        response.send("You must provide an english language name and a english subject in order");
    } else {
        db.query("select username, first_name, last_name from thetutor4u.user where subject_name = $1;", [
            request.body.subject
        ])
            .then(({rows}) => {
                response.statusCode = 200;
                response.send(rows);
            })
            .catch((error) => {
                console.log(error);
                response.statusCode = 500;
                response.send("database error");
            });
    }
});
server.post("/api/active-tutors", (request, response) => {});

server.get("/api/user-languages", (request, response) => {
    getUser(request, response, (user) => {
        if (user === false) {
            response.statusCode = 400;
            response.send("Log in to access this endpoint. ");
        } else {
            db.query("select language_code from thetutor4u.language_user where user_id = $1;", [user.sub])
                .then(({rows}) => {
                    const responseArray = [];
                    for (let a = 0; a < rows.length; ++a) {
                        responseArray.push(rows[a]["language_code"]);
                    }
                    response.statusCode = 200;
                    response.send(JSON.stringify(responseArray));
                })
                .catch(() => {
                    console.log("database error");
                });
        }
    });
});
module.exports = server;
