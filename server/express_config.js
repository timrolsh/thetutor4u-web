const express = require("express");
const server = express();
const session = require("express-session");
const db = require("./db_pool");
const crypto = require("crypto");
const passport = require("passport");

// load variables from .env
require("dotenv").config();
// check that all env variables are there
if (
    !(
        process.env.DEV &&
        process.env.PORT &&
        process.env.PGUSER &&
        process.env.PGHOST &&
        process.env.PGDATABASE &&
        process.env.PGPASSWORD &&
        process.env.PGPORT &&
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET
    )
) {
    console.log(
        "Not all enviornment variables have been properly declared. Create a .env file and copy from the readme. "
    );
    process.exit();
}
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

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost/auth/google/passport",
            scope: ["profile", "email"]
        },
        (accessToken, refreshToken, profile, callback) => {
            db.query("select * from thetutor4u.user where id = $1;", [profile.id])
                .then((dbResponse) => {
                    console.log("made query");
                    // if user does not exist in the database, add a new entry for them
                    if (dbResponse.rows.length === 0) {
                        console.log("new user but not found in database, updating database");
                        db.query(
                            "insert into thetutor4u.user (id, email, username, first_name, last_name, " +
                                "time_account_created) values ($1, $2, $3, $4, $5, $6);",
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
                            callback(null, profile);
                        });
                    } else {
                        console.log("authenticated user is in database, continuing...")
                        callback(null, profile);
                    }
                })
                .catch(() => {
                    console.log("query was unsuccessful");
                    callback(null, profile);
                });
        }
    )
);

module.exports = {server: server, passport: passport};
