const express = require("express");
const {auth} = require("express-openid-connect");
const server = express();

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
    auth({
        authRequired: false,
        auth0Logout: true,
        secret: process.env.SECRET,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        issuerBaseURL: process.env.ISSUER_BASE_URL
    })
);



module.exports = server;
