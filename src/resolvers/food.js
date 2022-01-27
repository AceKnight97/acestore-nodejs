const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated } = require("./authorization");
const _ = require("lodash");
const moment = require("moment");

module.exports = {
  Query: {
    menu: async (parent, { date }, { models, me }) => {},
  },

  Mutation: {
    addFood: combineResolvers(
      isAuthenticated,
      async (parent, { input }, { models, me }) => {
        const { email, food } = input;
        const data = await models.UserSpending.findOne({
          date,
          user: me.id,
        });
        console.log({ data, email, food });
      }
    ),
    // updatefood: combineResolvers(
    //   isAuthenticated,
    //   async (parent, { input }, { models, me }) => {}
    // ),
    // deletefood: combineResolvers(
    //   isAuthenticated,
    //   async (parent, { input }, { models, me }) => {}
    // ),
  },
};
