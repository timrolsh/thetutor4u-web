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
Route for updating user settings: Updates user settings if input is valid and sends status code 200. Otherwise, sends 
400 with error message
*/
server.post("/api/update-settings", (request, response) => {
    getUser(request, response, (user) => {
        if (
            user === false ||
            !(
                request.body.username &&
                request.body.first_name &&
                request.body.last_name &&
                request.body.email &&
                request.body.dob
            )
        ) {
            response.statusCode = 400;
            response.send(
                "You must be logged in to access this api endpoint. You must also provide the following fields: " +
                    "username, first_name, last_name, email, dob"
            );
        } else {
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
                    if (request.body.tutor_bio !== undefined) {
                        db.query("update thetutor4u.tutor set biography = $1 where user_id = $2", [
                            request.body.tutor_bio,
                            user.sub
                        ])
                            .then(() => {
                                response.statusCode = 200;
                                response.send("done");
                            })
                            .catch(() => {
                                response.statusCode = 500;
                                response.send("database issue");
                            });
                    } else {
                        response.statusCode = 200;
                        response.send("done");
                    }
                })
                .catch(() => {
                    response.statusCode = 500;
                    response.send("database issue");
                });
        }
    });
});

/*
Temporary sign up route for tutors, will be used only for demo purposes
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
                        response.redirect("/tutor");
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
module.exports = server;
