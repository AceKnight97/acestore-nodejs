const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./types");
const resolvers = require("./resolvers");
const express = require("express");
const { createServer } = require("http");
const { formatError, context } = require("./auth");

const PORT = process.env.PORT;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  formatError,
  context,
  // subscriptions: {
  //   onConnect: (connectionParams, webSocket, context) => {
  //     console.log("Connected!");
  //   },
  //   onDisconnect: (webSocket, context) => {
  //     console.log("Disconnected!");
  //   },
  //   // ...other options...
  // },
  // plugins: [
  //   {
  //     async serverWillStart() {
  //       return {
  //         async drainServer() {
  //           subscriptionServer.close();
  //         },
  //       };
  //     },
  //   },
  // ],
  // plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const app = express();
const corsOptions = {
  origin: "*",
};

server.applyMiddleware({ app, cors: corsOptions });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

const startServer = () => {
  httpServer.listen({ port: PORT }, () => {
    console.log(`Apollo Server on http://localhost:${PORT}/graphql`);
  });
};
module.exports = startServer;
