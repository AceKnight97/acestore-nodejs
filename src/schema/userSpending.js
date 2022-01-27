import { gql } from "apollo-server-express";


export default gql`
  extend type Query {
    dailyInfo(date: String!): SpendingResponse
    insight(from: String!, to: String!): [SpendingResponse]!
  }

  extend type Mutation {
    addDailyInfo(input: AddDailyInput!): MutationResponse!
    updateLogs(input: UpdateLogsInput!): MutationResponse!
    updateIncome(input: UpdateIncomeInput!): MutationResponse!
  }

  type Log {
    title: String!
    money: Float!
    details: String!
  }

  type SpendingResponse {
    id: ID!
    date: String!
    logs: [Log]
    income: Float
    notes: String
  }

  input UpdateIncomeInput {
    id: ID!
    income: Float
    notes: String
  }

  input LogInput {
    title: String!
    money: Float!
    details: String!
  }

  input UpdateDailyInput {
    id: ID!
    logs: [LogInput]
    income: Float
    notes: String
  }

  input AddDailyInput {
    date: String!
    logs: [LogInput]
    income: Float
    notes: String
  }

  input UpdateLogsInput {
    id: ID!
    logs: [LogInput]
  }

`;
