const {OAuth2Client} = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.CLIENT_ID);
const db = require("./db_pool");
const jwt = require("jsonwebtoken");
const rootPath = require("./root_path");
const publicKey = require("fs").readFileSync(`${rootPath}/authentication/jwtRS256.key.pub`);

/*
Rreturns true if the token has not expired yet, and return false if the token has expired and is no longer valid. 
*/
function validTimeToken(userData) {
    return userData.iss === "email" || parseInt(Date.now() / 1000) < parseInt(userData.exp);
}

/*
This method tries to pull the data from the web token provided in the cookie and then verify that token. Once token is
verify, run the callback with the user object
*/
function getUser(request, response, callback) {
    // if the token cookie exists
    if (request.cookies.token) {
        const user = JSON.parse(Buffer.from(request.cookies.token.split(".")[1], "base64").toString());
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
                try {
                    let user = jwt.verify(request.cookies.token, publicKey);
                    callback(user);
                } catch (error) {
                    callback(false);
                }
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

module.exports = {
    getUser: getUser,
    validTimeToken: validTimeToken,
    googleClient: googleClient
};
