const { ApolloServer, AuthenticationError } = require("apollo-server-express");
// // const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const typeDefs = require("./types");
const resolvers = require("./resolvers");
const models = require("./models");
const loaders = require("./loaders");
const DataLoader = require("dataloader");
const jwt = require("jsonwebtoken");
const { createServer } = require("http");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const cors = require("cors");

const secret = process.env.SECRET;

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

const startServer = async () => {
  const app = express();

  const httpServer = createServer(app);

  const corsOptions = {
    origin: "ws://localhost:8080/subscriptions",
    credentials: true, // <-- REQUIRED backend setting
  };
  app.use(cors(corsOptions));

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
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
            user: new DataLoader((keys) =>
              loaders.user.batchUsers(keys, models)
            ),
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
            user: new DataLoader((keys) =>
              loaders.user.batchUsers(keys, models)
            ),
          },
        };
      }
      return null;
    },
  });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: "/graphql" }
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });
  const PORT = 8080;
  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
};

module.exports = startServer;
