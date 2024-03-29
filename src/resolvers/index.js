const { GraphQLDateTime } = require("graphql-iso-date");
const userResolvers = require("./user");
const foodResolvers = require("./food");
const foodOrderResolvers = require("./foodOrder");
const popupScheduleResolvers = require("./popupSchedule");

const customScalarResolver = {
  Date: GraphQLDateTime,
};

module.exports = [
  customScalarResolver,
  userResolvers,
  foodResolvers,
  foodOrderResolvers,
  popupScheduleResolvers,
];
