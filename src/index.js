const connectDb = require("./config/db");
const server = require("./apolloServer3");
require("dotenv/config");

connectDb();
server();
