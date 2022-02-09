const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated } = require("./authorization");
const _ = require("lodash");
const moment = require("moment");
const models = require("../models");
const Email = require("../helper");

const timeIso = (x) => moment(x, "DD/MM/YYYY").toISOString();

const handleAnyCustomerOrder = async (customer = {}) => {
  const { email, username, password, address, phone } = customer;
  const isExisted = await models.User.findOne({ email });
  if (isExisted) {
    return isExisted;
  }
  const user = await models.User.create({
    username,
    email,
    password,
    isVerified: false,
    verificationCode: Math.floor(100000 + Math.random() * 900000),
    signUpDate: moment(),
    address,
    phone,
    role: "Client",
  });
  Email.sendVerifyEmail(email, user.verificationCode);
  return user;
};

module.exports = {
  Query: {
    orderHistory: async (parent, { date, isAll = false }, { me }) => {
      if (!me) {
        return [];
      }
      const filterObject = {
        createdAt: {
          $gte: moment(date, "DD/MM/YYYY").startOf("D").toISOString(),
          $lte: moment(date, "DD/MM/YYYY").endOf("D").toISOString(),
        },
        user: me.id,
      };
      if (isAll && me.role === "Admin") {
        delete filterObject.user;
      }
      try {
        const res = await models.FoodOrder.find(filterObject).sort({
          createdAt: "asc",
        });
        return res;
      } catch (error) {
        return [];
      }
    },
  },

  Mutation: {
    createOrder: combineResolvers(
      isAuthenticated,
      async (parent, { input }, { me }) => {
        const res = { isSuccess: false, message: "" };
        if (!me) {
          _.assign(res, { message: "No current user" });
          return res;
        }
        const createdAt = Date.now();
        input.forEach((x) => {
          _.assign(x, { user: me.id, createdAt });
        });
        try {
          await models.FoodOrder.create(input);
        } catch (error) {
          _.assign(res, { message: error });
          return res;
        }
        _.assign(res, { isSuccess: true });
        return res;
      }
    ),
    createAnyCustomerOrder: async (parent, { input }) => {
      const { customer, orders } = input || {};
      const res = { isSuccess: false, message: "" };
      const me = await handleAnyCustomerOrder(customer);
      const createdAt = Date.now();
      orders.forEach((x) => {
        _.assign(x, { user: me.id, createdAt });
      });
      try {
        await models.FoodOrder.create(orders);
      } catch (error) {
        _.assign(res, { message: error });
        return res;
      }
      _.assign(res, { isSuccess: true });
      return res;
    },
  },
};
