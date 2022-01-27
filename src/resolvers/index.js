const { GraphQLDateTime } = require("graphql-iso-date");
const userResolvers = require("./user");
const foodResolvers = require("./food");

const customScalarResolver = {
  Date: GraphQLDateTime,
};

module.exports = [customScalarResolver, userResolvers, foodResolvers];
