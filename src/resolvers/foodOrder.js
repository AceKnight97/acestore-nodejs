const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated } = require("./authorization");
const { PubSub } = require("graphql-subscriptions");
const _ = require("lodash");
const moment = require("moment");
const models = require("../models");
const Email = require("../helper");
const pubsub = new PubSub();
const MESSAGES = require("../constants/messages");
const { ALL_SUBSCRIPTIONS } = require("../constants");

const { NEW_FOOD_ORDER } = ALL_SUBSCRIPTIONS;

const handleAnyCustomerOrder = async (customer = {}) => {
  const { phone, password, address } = customer;
  const isExisted = await models.User.findOne({ phone });
  if (isExisted) {
    return isExisted;
  }
  const user = await models.User.create({
    phone,
    password,
    verificationCode: Math.floor(100000 + Math.random() * 900000),
    signUpDate: moment(),
    address,
    role: "Client",
    isVerified: false,
  });
  // Email.sendVerifyEmail(email, user.verificationCode);
  return user;
};

const getOrderHistory = async (res = [], user = {}) => {
  const final = [];
  const foodData = res.map(async (x) => await models.Food.findById(x.food));
  // console.log({ foodData });
  res.forEach((x, i) => {
    final.push({
      food: foodData[i],
      foodOrder: x,
      user,
    });
  });
  return final;
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
        const user = await models.User.findById(me.id);
        // console.log({ res, user });
        const final = await getOrderHistory(res, user);
        // console.log({ final });
        return final;
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
          const foodOrder = await models.FoodOrder.create(input);
          const user = await models.User.findById(me.id);
          const newFoodOrders = await getOrderHistory(foodOrder, user);
          pubsub.publish(NEW_FOOD_ORDER, {
            newFoodOrders,
          });
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
    changeOrderStatus: combineResolvers(
      isAuthenticated,
      async (parent, { status, orderId }, { me }) => {
        const res = { isSuccess: false, message: "" };
        if (me?.role !== "Admin") {
          _.assign(res, { message: MESSAGES.NOT_ADMIN });
          return res;
        }
        try {
          const order = await models.FoodOrder.findOneAndUpdate(
            {
              _id: orderId,
            },
            {
              status,
            }
          );
          return { isSuccess: Boolean(order) };
        } catch (error) {
          _.assign(res, { message: error });
          return res;
        }
      }
    ),
  },

  Subscription: {
    newFoodOrders: {
      subscribe: () => pubsub.asyncIterator([NEW_FOOD_ORDER]),
    },
  },
};
