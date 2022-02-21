const express = require("express");
const connectDb = require("./config/db");
const server = require("./apolloServer");
const cors = require("cors");

const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);
io.on("connection", (socket) => {
  console.log({ socket: socket.id });
  socket.on("hello", (data) => {
    socket.emit("aaa", "fac");
    console.log({ hello: data });
  });
});
httpServer.listen(8081);

module.exports = httpServer;
