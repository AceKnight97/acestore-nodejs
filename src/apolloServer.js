const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { ApolloServer } = require("apollo-server");
const typeDefs = require("./types");
const resolvers = require("./resolvers");
const httpServer = require("./socketIO");
const { formatError, context } = require("./auth");

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
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const startServer = () => {
  server
    .listen({ port: process.env.PORT || 8080 })
    .then(({ url, subscriptionsUrl }) => {
      console.log(`🚀 Server ready at ${url}`);
      console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
      // console.log(`🚀 Server ready at http://localhost:8080`);
    });
};
module.exports = startServer;
