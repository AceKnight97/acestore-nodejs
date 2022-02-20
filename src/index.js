const connectDb = require("./config/db");
const server = require("./apolloServer");
require("dotenv/config");

connectDb();

server.listen({ port: process.env.PORT || 8080 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  // console.log(`🚀 Server ready at http://localhost:8080`);
});
