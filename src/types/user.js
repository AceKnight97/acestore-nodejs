const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    users: [UsersResponse]!
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(username: String!, email: String!, password: String!): SignUpData!

    signIn(email: String!, password: String!): SignInData!

    updateUser(profileInput: ProfileInput!): MutationResponse!
    deleteUser(id: ID!): MutationResponse!
    verifiedEmail(verificationCode: String!): MutationResponse!
    changePassword(
      password: String!
      newPassword: String!
    ): TokenMutationResponse!
    resetPassword(
      verificationCode: String!
      password: String!
    ): TokenMutationResponse!
    forgotPassword(email: String!): MutationResponse!

    resendVerifiedEmail: MutationResponse!
  }

  input ProfileInput {
    username: String!
    gender: String
    address: String
    phone: String
    dob: Date
    role: String
  }

  type SignUpData {
    token: String!
    isSuccess: Boolean
  }

  type SignInDataInner {
    token: String!
    user: User
  }

  type SignInData {
    isSuccess: Boolean
    data: SignInDataInner
  }

  type UsersResponse {
    id: ID!
    username: String!
    email: String!
    role: String
    signUpDate: Date
    # NEW FIELDS
    status: String
    gender: String
    address: String
    phone: String
    dob: Date
    isVerified: Boolean
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String
    signUpDate: Date
    # NEW FIELDS
    status: String
    gender: String
    address: String
    phone: String
    dob: Date
    isVerified: Boolean

    # PROFILE INFO
    firstDate: String
    totalSpending: Float
    totalIncome: Float
    moneyLeft: Float
  }

  type MutationResponse {
    isSuccess: Boolean!
    message: String
  }

  type TokenMutationResponse {
    isSuccess: Boolean!
    message: String
    token: String
  }
`;
