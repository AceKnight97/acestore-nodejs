const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    menu: [FoodResponse]
  }

  extend type Mutation {
    addFood(input: AddFood!): MutationResponse!
  }

  input Food {
    title: String
    name: String
    rating: Int
    price: Float
    quantityType: String
  }

  type FoodResponse {
    id: ID!
    title: String
    name: String
    rating: Int
    price: Float
    quantityType: String
    createdAt: String
  }

  input AddFood {
    email: String
    food: [Food]
  }
`;
