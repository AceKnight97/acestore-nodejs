const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    orderHistory(date: String!, isAll: Boolean): [OrderHistoryResponse]
  }

  extend type Mutation {
    createOrder(input: [OrderInput]!): MutationResponse!
    createAnyCustomerOrder(input: AnyCustomerOrderInput!): MutationResponse!
    changeOrderStatus(status: String!, orderId: ID!): MutationResponse!
  }

  extend type Subscription {
    newFoodOrders: [OrderHistoryResponse]
  }

  type FoodOrder {
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

  type OrderHistoryResponse {
    food: FoodResponse
    foodOrder: FoodOrder
    user: User
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
