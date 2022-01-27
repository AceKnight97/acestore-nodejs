import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from './authorization';

export default {
  Query: {
    categories: async (parent, args, { models, me }) => {
      const criteria = {
        $or: [{ isDefault: true }, { user: me.id }],
        isActive: true,
      };
      const categories = await models.Category.find(criteria);
      return categories;
    },
  },

  Mutation: {
    createCategory: combineResolvers(
      isAuthenticated,
      async (parent, { name, parent: parentCategoryId, icon }, { models, me }) => {
        const categoryObj = {
          name,
          parent: parentCategoryId,
          icon,
          isDefault: false,
          isActive: true,
          user: me.id,
        };
        if (parentCategoryId) {
          const parentCategory = await models.Category.findById(parentCategoryId);
          const { ancestors } = parentCategory || { ancestors: [] };
          ancestors.push(parentCategoryId);
          categoryObj.ancestors = ancestors;
        }
        const category = await models.Category.create(categoryObj);
        return category;
      },
    ),
  },

  Category: {
    user: async (category, args, { loaders }) => {
      if (category.user) {
        const result = await loaders.user.load(category.user);
        return result;
      }
      return null;
    },
  },
};
