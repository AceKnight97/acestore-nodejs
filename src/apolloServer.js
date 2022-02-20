const { ApolloServer, AuthenticationError } = require("apollo-server");
const typeDefs = require("./types");
const resolvers = require("./resolvers");
const models = require("./models");
const loaders = require("./loaders");
const DataLoader = require("dataloader");
const jwt = require("jsonwebtoken");
// const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  // context: {models},
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
  //   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

module.exports = server;
