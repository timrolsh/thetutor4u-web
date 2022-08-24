require("dotenv").config();

const db = require("./db_pool");

db.query("select id from thetutor4u.user where username = $1;", ["310c4eb7-e8ee-42d2-9e6e-09ea95026103"]).then((a) => {
    console.log(a);
});
