const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    orderHistory(date: String!, isAll: Boolean): [OrderHistoryResponse]
  }

  extend type Mutation {
    createOrder(input: [OrderInput]!): MutationResponse!
    createAnyCustomerOrder(input: AnyCustomerOrderInput!): MutationResponse!
  }

  type OrderHistoryResponse {
    id: ID!
    food: ID!
    quantity: Float
    createdAt: Date
    email: String
    notes: String
    status: String
    price: Float
    destination: String
  }

  input AnyCustomerOrderInput {
    customer: CustomerInput!
    orders: [OrderInput]
  }

  input OrderInput {
    food: ID!
    quantity: Float
    email: String
    notes: String
    status: String
    price: Float
    destination: String
  }

  input CustomerInput {
    address: String
    email: String
    password: String
    phone: String
    username: String
  }
`;
