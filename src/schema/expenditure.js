import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    expenditures(cursor: String, limit: Int): ExpenditureConnection
  }

  extend type Mutation {
    createExpenditure(expenditureInput: ExpenditureInput): Expenditure!
  }

  input ExpenditureInput {
    date: Date!
    title: String!
    spending: Float!
    detail: String
    category: ID!
  }

  type Expenditure {
    id: ID!
    date: Date!
    title: String!
    spending: Float!
    detail: String
    category: Category
  }

  type ExpenditureConnection {
    edges: [Expenditure!]!
    pageInfo: PageInfo!
  }

`;
