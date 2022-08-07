const express = require("express");
const server = express();
const session = require("express-session");
const db = require("./db_pool");

const crypto = require("crypto");
const passport = require("passport");

// load variables from .env
require("dotenv").config();
// root path of this project
const rootPath = require("./root_path");

if (process.env.DEV === "true") {
    // use morgan logger if in development
    server.use(require("morgan")("dev"));
}

// bootstrap files path
server.use("/bootstrap", express.static(`${rootPath}/node_modules/bootstrap`));
// static files routes
server.use(express.static(`${rootPath}/static`));
// use ejs for server side rendering
server.set("views", `${rootPath}/pages`);
server.set("view engine", "ejs");

// json middleware
server.use(express.urlencoded({extended: false}));
server.use(express.json());

server.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: "SECRET"
    })
);

server.use(passport.initialize());
server.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

const GoogleStrategy = require("passport-google-oauth2").Strategy;
const GOOGLE_CLIENT_ID = "240249167376-5b49a6dja4hb007kamoomptlev3a2sq4.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost/auth/google/callback",
            scope: ["profile", "email", "openid"]
        },
        (accessToken, refreshToken, profile, callback) => {
            db.query("select * from thetutor4u.user where id = $1", [profile.id]).then((dbResponse) => {
                // if user does not exist in the database, add a new entry for them
                if (dbResponse.rows.length === 0) {
                    db.query(
                        "insert into thetutor4u.user (id, email, username, first_name, last_name, " +
                            "time_account_created) values ($1, $2, $3, $4, $5, $6)",
                        [
                            profile.id,
                            profile.emails[0].value,
                            crypto.randomUUID(),
                            profile.given_name,
                            profile.family_name,
                            Date.now()
                        ]
                    ).then(() => {
                        console.log("inserted new user");
                    });
                }
            });
            callback(null, profile);
        }
    )
);

module.exports = {server: server, passport: passport};
