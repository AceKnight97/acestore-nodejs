const { GraphQLDateTime } = require("graphql-iso-date");
const userResolvers = require("./user");
const userSpendingResolvers = require("./userSpending");

const customScalarResolver = {
  Date: GraphQLDateTime,
};

module.exports = [
  customScalarResolver,
  userResolvers,
  userSpendingResolvers,
];