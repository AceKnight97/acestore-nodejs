import { GraphQLDateTime } from "graphql-iso-date";

import userResolvers from "./user";
import userSpendingResolvers from "./userSpending";
// import messageResolvers from "./message";
// import categoryResolvers from "./category";
// import expenditureResolvers from './expenditure';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  userSpendingResolvers,
  // messageResolvers,
  // categoryResolvers,
  // expenditureResolvers,
];
