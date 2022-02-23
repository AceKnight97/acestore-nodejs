const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    users: [UsersResponse]!
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(phone: String!, password: String!, address: String!): SignUpData!

    signIn(phone: String!, password: String!): SignInData!

    updateUser(profileInput: ProfileInput!): UpdateUserResponse!
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
    testSendSMS(phone: String!): MutationResponse!
  }

  input ProfileInput {
    email: String
    username: String
    gender: String
    address: String
    dob: Date
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
    username: String
    email: String
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

  type MutationResponse {
    isSuccess: Boolean!
    message: String
  }

  type UpdateUserResponse {
    isSuccess: Boolean!
    message: String
    user: User
  }

  type TokenMutationResponse {
    isSuccess: Boolean!
    message: String
    token: String
  }
`;
