const server = require("./express_api_routes");
const db = require("./db_pool");

db.query("select 1 * 1;")
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`server launched on port ${process.env.PORT}. Go to http://localhost:${process.env.PORT}`);
        });
    })
    .catch(() => {
        console.log("Unable to start server, cannot connect to database. ");
    });
