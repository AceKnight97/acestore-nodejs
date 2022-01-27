import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    categories: [Category]
  }

  extend type Mutation {
    createCategory(name: String, parent: ID, icon: String): Category!
  }

  type Category {
    id: ID!
    ancestors: [String]
    parent: ID
    isActive: Boolean!
    name: String!
    user: User
    icon: String
  }
`;
