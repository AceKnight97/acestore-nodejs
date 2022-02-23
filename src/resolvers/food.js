const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated } = require("./authorization");
const models = require("../models");
const MESSAGES = require("../constants/messages");
const _ = require("lodash");

module.exports = {
  Query: {
    menu: async (parent, {}, {}) => {
      return models.Food.find();
    },
  },

  Mutation: {
    addFood: combineResolvers(
      isAuthenticated,
      async (parent, { input }, { me }) => {
        const res = { isSuccess: false, message: "" };
        if (me.role !== "Admin") {
          _.assign(res, { message: MESSAGES.NOT_ADMIN });
          return res;
        }
        try {
          await models.Food.create(input);
          return { isSuccess: true };
        } catch (error) {
          _.assign(res, { message: error });
          return res;
        }
      }
    ),
    updateFood: combineResolvers(
      isAuthenticated,
      async (parent, { input }, { me }) => {
        const res = { isSuccess: false, message: "" };
        if (me.role !== "Admin") {
          _.assign(res, { message: MESSAGES.NOT_ADMIN });
          return res;
        }
        try {
          const pendingPromises = [];
          const updatedAt = Date.now();
          input.forEach((x) => {
            if (!x.id) {
              _.assign(res, { message: MESSAGES.NOT_ID });
              return res;
            }
            _.assign(x, { updatedAt });
            pendingPromises.push(
              models.Food.findOneAndUpdate(
                { _id: x.id },
                {
                  title: x.title,
                  name: x.name,
                  rating: x.rating,
                  price: x.price,
                  quantityType: x.quantityType,
                  image: x.image,
                }
              )
            );
          });
          await Promise.all(pendingPromises);
          return { isSuccess: true };
        } catch (error) {
          _.assign(res, { message: error });
          return res;
        }
      }
    ),
    deleteFood: combineResolvers(
      isAuthenticated,
      async (parent, { input }, { me }) => {
        const res = { isSuccess: false, message: "" };
        if (me.role !== "Admin") {
          _.assign(res, { message: MESSAGES.NOT_ADMIN });
          return res;
        }
        try {
          const pendingPromises = [];
          input.forEach((x) => {
            if (!x) {
              _.assign(res, { message: MESSAGES.NOT_ID });
              return res;
            }
            pendingPromises.push(models.Food.deleteOne({ _id: x }));
          });
          await Promise.all(pendingPromises);
          return { isSuccess: true };
        } catch (error) {
          _.assign(res, { message: error });
          return res;
        }
      }
    ),
  },
};
