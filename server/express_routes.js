const {server, passport} = require("./express_config");
const rootPath = require("./root_path");

const db = require("./db_pool");

server.get("/", (request, response) => {
    response.sendFile(`${rootPath}/pages/index.html`);
});

server.get("/success", (req, res) => res.send(userProfile));
server.get("/error", (req, res) => res.send("error logging in"));

server.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
server.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });

/* 
formData is an object that looks like this
{
    dob_day: string;
    dob_month: string;
    dob_year: string;
    first_name: string;
    last_name: string;
    username: string;
}
*/
function verifyFormData(formData) {
    // TODO implement this
    return true;
}

server.post("/signup-submit", (request, response) => {
    checkUser(request, response, "signup", () => {
        if (verifyFormData(request.body)) {
            db.query(
                "update thetutor4u.user set username = $1, first_name = $2, last_name = $3, dob_day = $4, dob_month" +
                    " = $5, dob_year = $6, time_account_created = $7, account_set_up = 1",
                [
                    request.body.username,
                    request.body.first_name,
                    request.body.last_name,
                    Number(request.body.dob_day),
                    Number(request.body.dob_month),
                    Number(request.body.dob_year),
                    Date.now()
                ]
            ).then(() => {
                response.redirect("/dashboard");
            });
        } else {
            response.statusCode = 401;
            response.send("invalid form data");
        }
    });
});
module.exports = server;
