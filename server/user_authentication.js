const {OAuth2Client} = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.CLIENT_ID);
const atob = require("atob");
const db = require("./db_pool");

/*
Rreturns true if the token has not expired yet, and return false if the token has expired and is no longer valid. 
*/
function validTimeToken(userData) {
    return parseInt(Date.now() / 1000) < parseInt(userData.exp);
}

/*
This method tries to pull the data from the web token provided in the cookie and then verify that token. Once token is
verify, run the callback with the user object
*/
function getUser(request, response, callback) {
    // if the token cookie exists
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
                    .then((token) => {
                        callback(token.getPayload());
                    })
                    .catch(() => {
                        // token is expried/couldn't be verified by google

                        callback(false);
                    });
            } else {
                console.log("identity provider is not google");
                callback(user);
            }
        }
        // otherwise token is expired,
        else {
            response.clearCookie("token");
            callback(false);
        }
        // otherwise token cookie does not exist
    } else {
        callback(false);
    }
}
// returns a promise that resolves to the user info
function getFullUserInfo(user) {
    return new Promise((resolve, reject) => {
        db.query("select * from thetutor4u.user where id = $1;", [user.sub])
            .then((dbResponse) => {
                db.query("select * from thetutor4u.tutor where user_id = $1;", [user.sub])
                    .then((tutorResponse) => {
                        // user is not a tutor
                        if (tutorResponse.rows.length === 0) {
                            dbResponse["rows"][0]["is_tutor"] = false;
                            resolve({authProviderInfo: user, dbInfo: dbResponse.rows[0]});
                        }
                        // user is a tutor
                        else {
                            dbResponse["rows"][0]["is_tutor"] = true;
                            resolve({
                                authProviderInfo: user,
                                dbInfo: dbResponse.rows[0],
                                dbTutorInfo: tutorResponse.rows[0]
                            });
                        }
                    })
                    .catch((error) => {
                        reject(error);
                    });
            })
            .catch((error) => {
                reject(error);
            });
    });
}

module.exports = {
    getUser: getUser,
    validTimeToken: validTimeToken,
    googleClient: googleClient,
    getFullUserInfo: getFullUserInfo
};
