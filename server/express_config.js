const express = require("express");
const server = express();
const db = require("./db_pool");
const cookieParser = require("cookie-parser");
server.use(cookieParser());

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

module.exports = server;
