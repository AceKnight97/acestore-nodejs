const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated } = require("./authorization");
const moment = require("moment");
const models = require("../models");
const MESSAGES = require("../constants/messages");
const { AuthenticationError } = require("apollo-server");


module.exports = {
  Query: {
    popupsSchedule: async (parent, { date, isAll = false }, { me }) => {
      if (!me) {
        return [];
      }
      const filterObject = {
        createdAt: {
          $gte: moment(date, "DD/MM/YYYY").startOf("D").toISOString(),
          $lte: moment(date, "DD/MM/YYYY").endOf("D").toISOString(),
        },
      };
      if (me.role !== "Admin") {
        throw new AuthenticationError("Only admin can check the ")
      }
      try {
        const res = await models.PopupSchedule.find(filterObject).sort({
          createdAt: "asc",
        });
        // console.log({ final });
        return res;
      } catch (error) {
        return [];
      }
    },
  },

  Mutation: {
    createSchedule: combineResolvers(
      isAuthenticated,
      async (parent, { input }, { me }) => {
        console.log('first')
        const res = { isSuccess: false, message: "" };
        if (!me) {
          Object.assign(res, { message: "No current user" });
          return res;
        }
        const createdAt = Date.now();
        console.log({ input });
        console.log({ fromDate: moment(input.fromDate, "DD/MM/YYYY").startOf("D").toISOString() })
        Object.assign(input, {
          createdAt,
          fromDate: moment(input.fromDate, "DD/MM/YYYY").startOf("D").toISOString(),
          toDate: moment(input.toDate, "DD/MM/YYYY").startOf("D").toISOString(),
        });
        try {
          await models.PopupSchedule.create(input);
        } catch (error) {
          Object.assign(res, { message: error });
          return res;
        }
        Object.assign(res, { isSuccess: true });
        return res;
      }
    ),
    changeScheduleStatus: combineResolvers(
      isAuthenticated,
      async (parent, { status, orderId }, { me }) => {
        const res = { isSuccess: false, message: "" };
        if (me?.role !== "Admin") {
          Object.assign(res, { message: MESSAGES.NOT_ADMIN });
          return res;
        }
        try {
          const order = await models.PopupSchedule.findOneAndUpdate(
            {
              _id: orderId,
            },
            {
              status,
            }
          );
          return { isSuccess: Boolean(order) };
        } catch (error) {
          Object.assign(res, { message: error });
          return res;
        }
      }
    ),
  },
};
