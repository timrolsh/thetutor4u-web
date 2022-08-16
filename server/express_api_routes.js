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
                    response.statusCode = 200;
                    // if username does not exist
                    response.send("done");
                })
                .catch(() => {
                    response.statusCode = 500;
                    response.send("database issue");
                });
        }
    });
});

module.exports = server;
