const db = require("./db_pool");

function accountSetUp(query) {
    return query.rows[0].accountSetUp === 1;
}

function authZero(request) {
    return request.oidc.isAuthenticated();
}

function checkUser(request, response, page, callback) {
    // if user is not signed in with auth0, bring them to the homepage
    if (!authZero(request) && page !== "index") {
        response.redirect("/");
    } else if (authZero(request)) {
        db.query("select * from thetutor4u.user where id = $1", [request.oidc.user.sub]).then((query) => {
            // user is signed in but they do not exist in the database
            if (query.rows.length === 0) {
                db.query("insert into thetutor4u.user (id) values ($1)", [request.oidc.user.sub]).then(() => {
                    response.redirect("/signup");
                });
            }
            // user is on homepage
            if (page === "index") {
                // user account is set up fully and they are logged in
                if (authZero(request) && accountSetUp(query)) {
                    response.redirect("/dashboard");
                }
                // user account is not set up fully, they are logged in
                else if (authZero(request) && !accountSetUp(query)) {
                    response.redirect("/signup");
                }
                // user is not signed in at all, stay on home page
                else {
                    callback();
                }
            }
            // user is on signup page
            else if (page === "signup") {
                // user is not logged in with auth0
                if (!authZero(request)) {
                    response.redirect("/login");
                }
                // user is already fully signed up
                else if (authZero(request) && accountSetUp(query)) {
                    response.redirect("/dashboard");
                }
                // user is logged in with auth0 but is not fully signed up
                else {
                    callback();
                }
            }
            // user is on any any userspecific page (dashboard, calendar, balance, etc)
            else {
                // user is signed in and their account is fully activated
                if (authZero(request) && accountSetUp(query)) {
                    callback();
                } else {
                    response.redirect("/");
                }
            }
        });
    } else {
        callback();
    }
}

module.exports = checkUser;
