const { gql } = require("apollo-server");
const User = require("./user");
const UserSpending = require("./userSpending");
const Food = require("./food");

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;
module.exports = [linkSchema, User, UserSpending, Food];
