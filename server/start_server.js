const server = require("./express_routes");

server.listen(process.env.PORT, () => {
    console.log(`server launched on port ${process.env.PORT}`);
});
