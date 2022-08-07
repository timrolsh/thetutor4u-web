const express = require("express");
const server = express();
const session = require("express-session");

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

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID = "240249167376-5b49a6dja4hb007kamoomptlev3a2sq4.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost/auth/google/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            userProfile = profile;
            return done(null, userProfile);
        }
    )
);

module.exports = {server: server, passport: passport};
