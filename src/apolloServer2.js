const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./types");
const resolvers = require("./resolvers");
const { createServer } = require("http");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const cors = require("cors");
const { formatError, context } = require("./auth");

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
    formatError,
    context,
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
