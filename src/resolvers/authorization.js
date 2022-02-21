const { ForbiddenError } = require("apollo-server");
const { combineResolvers, skip } = require("graphql-resolvers");

function isAuthenticated(parent, args, { me }) {
  return me ? skip : new ForbiddenError("Not authenticated as user.");
}

const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) =>
    role === "ADMIN" ? skip : new ForbiddenError("Not authorized as admin.")
);

// async function isMessageOwner(parent, { id }, { models, me }) {
//   const message = await models.Message.findById(id);

//   if (message.userId != me.id) {
//     throw new ForbiddenError('Not authenticated as owner.');
//   }

//   return skip;
// }

module.exports = {
  isAuthenticated,
  isAdmin, // isMessageOwner
};
