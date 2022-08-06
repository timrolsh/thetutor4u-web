const server = require("./express_routes");
const db = require("./db_pool");

db.query("select online from thetutor4u.test;")
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`server launched on port ${process.env.PORT}`);
        });
    })
    .catch(() => {
        console.log("Unable to start server, cannot connect to database. ");
    });

