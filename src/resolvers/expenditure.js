import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from './authorization';

const fromCursorHash = (string) => Buffer.from(string, 'base64').toString('ascii');
const toCursorHash = (string) => Buffer.from(string).toString('base64');

export default {
  Query: {
    expenditures: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
          createdAt: {
            $lt: fromCursorHash(cursor),
          },
        }
        : {};
      const expenditures = await models.Expenditure.find(
        cursorOptions,
        null,
        {
          sort: { createdAt: -1 },
          limit: limit + 1,
        },
      );

      const hasNextPage = expenditures.length > limit;
      const edges = hasNextPage ? expenditures.slice(0, -1) : expenditures;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(
            edges[edges.length - 1].createdAt.toString(),
          ),
        },
      };
    },
  },

  Mutation: {
    createExpenditure: combineResolvers(
      isAuthenticated,
      async (parent, { expenditureInput }, { models, me }) => {
        expenditureInput.user = me.id;
        const expenditure = await models.Expenditure.create(expenditureInput);
        return expenditure;
      },
    ),
  },

  Expenditure: {
    category: async (expenditure, args, { loaders }) => {
      const result = await loaders.category.load(expenditure.category);
      return result;
    },
  },
};
