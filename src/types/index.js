const { gql } = require("apollo-server");
const User = require("./user");
const Food = require("./food");
const FoodOrder = require("./foodOrder");

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
module.exports = [linkSchema, User, Food, FoodOrder];
