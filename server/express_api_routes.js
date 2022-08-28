const server = require("./express_page_routes");
const db = require("./db_pool");
const {getUser} = require("./user_authentication");

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
            .catch((error) => {
                console.log(error);
                response.statusCode = 500;
                response.send("database error");
            });
    }
});

/*
Temporary sign up route for tutors, will be used only for demo purposes
*/
server.post("/api/register-tutor", (request, response) => {
    function dbError(error) {
        console.log(error);
        response.statusCode = 500;
        response.send("database error");
    }
    getUser(request, response, (user) => {
        // user is not logged in, go home
        if (user === false) {
            response.redirect("/");
        }
        // user is already counted as a tutor in the database
        db.query("select * from thetutor4u.tutor where user_id = $1;", [user.sub])
            .then(({rows}) => {
                // user is not already registered as a tutor in the database
                if (rows.length === 0) {
                    db.query("insert into thetutor4u.tutor (user_id) values ($1);", [user.sub])
                        .then(() => {
                            response.redirect("/tutor");
                        })
                        .catch(dbError);
                } else {
                    response.redirect("/tutor");
                }
            })
            .catch(dbError);
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
                .catch((error) => {
                    console.log(error);
                    response.statusCode = 500;
                    response.send("database error");
                })
                .then(() => {
                    response.statusCode = 200;
                    response.send("OK");
                });
        }
    });
});

/*
TODO add
*/
server.post("/api/active-students", (request, response) => {
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
// TODO add
server.post("/api/active-tutors", (request, response) => {});

/*
Returns user info in the following JSON format:
{
    email: string,
    username: string,
    first_name: string,
    last_name: string,
    dob: string in html date format,
    languages: list of language_codes,
    is_tutor: boolean, is the user a tutor or not? If this is false, all the other fields will be null,
    tutor_subjects: all of the subjects that the tutor is qualified to teach,
    tutor_bio: the tutor's bio,
}
*/
server.get("/api/user-info", (request, response) => {
    getUser(request, response, (user) => {
        if (user === false) {
            response.statusCode = 400;
            response.send("Log in to access this endpoint.");
        } else {
            let finalObject = {
                email: null,
                username: null,
                first_name: null,
                last_name: null,
                dob: null,
                languages: null,
                is_tutor: null,
                tutor_subjects: null,
                tutor_bio: null
            };
            function errorCallback(error) {
                console.log(error);
                response.statusCode = 500;
                response.send("database error");
                return;
            }
            db.query("select email, username, first_name, last_name, dob from thetutor4u.user where id = $1;", [
                user.sub
            ])
                .then(({rows}) => {
                    rows = rows[0];
                    finalObject["email"] = rows["email"];
                    finalObject["username"] = rows["username"];
                    finalObject["first_name"] = rows["first_name"];
                    finalObject["last_name"] = rows["last_name"];
                    finalObject["dob"] = rows["dob"];
                    db.query("select language_code from thetutor4u.language_user where user_id = $1;", [user.sub])
                        .then(({rows}) => {
                            finalObject["languages"] = [];
                            for (let a = 0; a < rows.length; ++a) {
                                finalObject["languages"].push(rows[a]["language_code"]);
                            }
                            db.query("select biography from thetutor4u.tutor where user_id = $1;", [user.sub]).then(
                                ({rows}) => {
                                    // user is not a tutor
                                    if (rows.length === 0) {
                                        finalObject["is_tutor"] = false;
                                        response.statusCode = 200;
                                        response.send(JSON.stringify(finalObject));
                                    } else {
                                        if (rows[0]["biography"] !== null) {
                                            finalObject["tutor_bio"] = rows[0]["biography"];
                                        }
                                        finalObject["is_tutor"] = true;
                                        db.query(
                                            "select subject_name from thetutor4u.subject_tutor where tutor_id = $1;",
                                            [user.sub]
                                        ).then(({rows}) => {
                                            finalObject["tutor_subjects"] = [];
                                            for (let a = 0; a < rows.length; ++a) {
                                                finalObject["tutor_subjects"].push(rows[a]["subject_name"]);
                                            }
                                            response.statusCode = 200;
                                            response.send(JSON.stringify(finalObject));
                                        });
                                    }
                                }
                            );
                        })
                        .catch(errorCallback);
                })
                .catch(errorCallback);
        }
    });
});

/*
Get all subjects that are available on the website
*/
server.get("/api/subjects", (_, response) => {
    db.query("select name from thetutor4u.subject;").then(({rows}) => {
        const responseArray = [];
        for (let a = 0; a < rows.length; ++a) {
            responseArray.push(rows[a]["name"]);
        }
        response.statusCode = 200;
        response.send(JSON.stringify(responseArray));
    });
});
module.exports = server;
