const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { ApolloServer, AuthenticationError } = require("apollo-server-express");
const typeDefs = require("./types");
const resolvers = require("./resolvers");
const models = require("./models");
const loaders = require("./loaders");
const DataLoader = require("dataloader");
const jwt = require("jsonwebtoken");
// const httpServer = require("./socketIO");
const cors = require("cors");
const express = require("express");
const { createServer } = require("http");

const secret = process.env.SECRET;
const PORT = process.env.PORT;

const getMe = async (req) => {
  const token = req.headers["access-token"];
  if (token) {
    try {
      const decoded = await jwt.verify(token, secret);
      return decoded;
    } catch (e) {
      throw new AuthenticationError("Your session expired. Sign in again.");
    }
  }
  return null;
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  formatError: (error) => {
    const message = error.message
      .replace("SequelizeValidationError: ", "")
      .replace("Validation error: ", "");

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader((keys) => loaders.user.batchUsers(keys, models)),
        },
      };
    }

    if (req) {
      const me = await getMe(req);
      return {
        models,
        me,
        secret,
        loaders: {
          user: new DataLoader((keys) => loaders.user.batchUsers(keys, models)),
        },
      };
    }
    return null;
  },
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

server.applyMiddleware({ app, path: "/graphql", cors: corsOptions });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

const startServer = () => {
  httpServer.listen({ port: PORT }, () => {
    console.log(`Apollo Server on http://localhost:${PORT}/graphql`);
  });

  // server
  //   .listen({ port: process.env.PORT || 8080 })
  //   .then(({ url, subscriptionsUrl }) => {
  //     console.log(`🚀 Server ready at ${url}`);
  //     console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
  //     // console.log(`🚀 Server ready at http://localhost:8080`);
  //   });
};
module.exports = startServer;
