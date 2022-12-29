const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    popupsSchedule(date: String!, isAll: Boolean): [ScheduleResponse]
  }

  extend type Mutation {
    createSchedule(input: ScheduleInput!): MutationResponse!
    changeScheduleStatus(status: String!, scheduleId: ID!): MutationResponse!
  }

  type ScheduleResponse {
    id: ID!
    fromDate: String
    toDate: String
    streetName: String
    address: String
    addressImg: String
    createdAt: Date
  }

  input ScheduleInput {
    fromDate: String!
    toDate: String!
    streetName: String!
    address: String!
    addressImg: String!
  }
`;
