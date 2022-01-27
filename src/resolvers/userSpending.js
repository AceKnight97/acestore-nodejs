import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./authorization";
import moment from "moment";
import _ from "lodash";

// const fromCursorHash = (string) =>
//   Buffer.from(string, "base64").toString("ascii");
// const toCursorHash = (string) => Buffer.from(string).toString("base64");

const timeIso = (x) => moment(x, "DD/MM/YYYY").toISOString();
const timeUtc = (x) => moment(x, "DD/MM/YYYY").utc();

const SPENDING_MESSAGES = {
  DUPLICATED_DATE: "DUPLICATED_DATE",
  NO_INFO: "NO_INFO",
  INVALID_DATE: "INVALID_DATE",
};
const { DUPLICATED_DATE, NO_INFO, INVALID_DATE } = SPENDING_MESSAGES;

const INVALID_DATE_FORMAT = {
  isSuccess: false,
  message: INVALID_DATE,
};

export default {
  Query: {
    dailyInfo: async (parent, { date }, { models, me }) => {
      const data = await models.UserSpending.findOne({
        date,
        user: me.id,
      });

      if (_.isEmpty(data)) {
        return null;
      }

      const tempObj = {
        id: data._id,
        date: data.date,
        logs: data.logs,
        income: data.income,
        notes: data.notes,
      };

      return tempObj;
    },

    insight: async (parent, { from, to }, { models, me }) => {
      const data = await models.UserSpending.find({
        user: me.id,
        iso: {
          $gte: timeIso(from),
          $lte: timeIso(to),
        },
      }).sort({iso: 'asc'});

      return _.map(data, (x) => ({
        id: x._id,
        date: x.date,
        logs: x.logs,
        income: x.income,
        notes: x.notes,
      }));
    },
  },

  Mutation: {
    addDailyInfo: combineResolvers(
      isAuthenticated,
      async (parent, { input }, { models, me }) => {
        const { date } = input;
        const data = await models.UserSpending.findOne({
          date,
          user: me.id,
        });

        if (data) {
          return {
            isSuccess: false,
            message: DUPLICATED_DATE,
          };
        }
        input.user = me.id;

        try {
          await models.UserSpending.create({
            ...input,
            iso: timeIso(date),
            utc: timeUtc(date),
          });
          return {
            isSuccess: true,
          };
        } catch (error) {
          return {
            isSuccess: false,
            message: error,
          };
        }
      }
    ),

    updateLogs: combineResolvers(
      isAuthenticated,
      async (parent, { input }, { models, me }) => {
        const { id, logs } = input;
        try {
          await models.UserSpending.findOneAndUpdate(
            { user: me.id, _id: id },
            { logs }
          );
          return {
            isSuccess: true,
          };
        } catch (error) {
          return {
            isSuccess: false,
            message: error,
          };
        }
      }
    ),

    updateIncome: combineResolvers(
      isAuthenticated,
      async (parent, { input }, { models, me }) => {
        const { id, income, notes } = input;
        try {
          await models.UserSpending.findOneAndUpdate(
            { user: me.id, _id: id },
            { income, notes }
          );
          return {
            isSuccess: true,
          };
        } catch (error) {
          return {
            isSuccess: false,
            message: error,
          };
        }
      }
    ),
  },
};
