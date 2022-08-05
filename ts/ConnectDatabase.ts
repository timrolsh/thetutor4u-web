import pg from "pg";

export default new pg.Pool({
    user: "root",
    host: "localhost",
    database: "postgres",
    password: "root",
    port: 5432
});
