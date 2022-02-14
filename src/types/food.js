const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    menu: [FoodResponse]
  }

  extend type Mutation {
    addFood(input: [AddFoodInput]!): MutationResponse!
    updateFood(input: [UpdateFoodInput]!): MutationResponse!
    deleteFood(input: [ID]!): MutationResponse!
  }

  input AddFoodInput {
    title: String
    name: String
    rating: Int
    price: Float
    quantityType: String
    image: String
  }

  input UpdateFoodInput {
    id: ID!
    title: String
    name: String
    rating: Int
    price: Float
    quantityType: String
    image: String
  }

  type FoodResponse {
    id: ID!
    title: String
    name: String
    rating: Int
    price: Float
    quantityType: String
    createdAt: String
    image: String
  }
`;
