// const { ApolloServer, AuthenticationError } = require("apollo-server");
const express = require("express");
const connectDb = require("./config/db");
const server = require("./apolloServer3");
const cors = require("cors");
require("dotenv/config");

connectDb();
server();
// server
//   .start({
//     cors: { credentials: true, origin: "/", port: process.env.PORT || 8080 },
//   })
//   .then(() => {
//     console.log("Started");
//   });

// server.applyMiddleware({
//   app,
//   path: "/graphql",
//   cors: {
//     credentials: true,
//     origin: process.env.PORT || "8080",
//   },
// });

// const app = express();
// const http = require("http").createServer(app);
// const io = require("socket.io")(http);
// io.listen(http);
// app.use(
//   cors({
//     credentials: true,
//     origin: "http://localhost:8080",
//   })
// );
// server.applyMiddleware({ app });
// app.listen({ port: 4000 }, () => console.log("Server up on port 4000"));
// server.listen({ port: process.env.PORT || 8080 }).then((http) => {
//   const { url } = http;
//   console.log(`🚀 Server ready at ${url}`);
// });
