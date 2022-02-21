const { combineResolvers } = require("graphql-resolvers");
const { AuthenticationError, UserInputError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const moment = require("moment");
const Email = require("../helper");
const { isAdmin, isAuthenticated } = require("./authorization");
const models = require("../models");

const secret = process.env.SECRET;

const createToken = async (user, expiresIn) => {
  const {
    id,
    email,
    username,
    role,
    address,
    phone,
    signUpDate,
    status,
    gender,
    dob,
    isVerified,
  } = user;
  const token = await jwt.sign(
    {
      id,
      email,
      username,
      role,
      address,
      phone,
      status,
      gender,
      dob,
      isVerified,
      signUpDate,
    },
    secret,
    {
      expiresIn,
    }
  );
  return token;
};

const getLogInfo = async (id) => {
  const data = await models.UserSpending.find({
    user: id,
  }).sort({ iso: "asc" });
  let totalSpending = 0;
  let totalIncome = 0;

  if (data?.length !== 0) {
    _.forEach(data, (x) => {
      const temp = _.sumBy(x.logs || [], (y) => y.money);
      totalSpending += temp;
      totalIncome += x.income || 0;
    });
  }
  return {
    firstDate: data?.[0]?.date || "",
    totalSpending,
    totalIncome,
    moneyLeft: totalIncome - totalSpending,
  };
};

module.exports = {
  Query: {
    users: async (parent, args, {}) => {
      const users = await models.User.find();
      return users || [];
    },
    user: async (parent, { id }, {}) => {
      const user = await models.User.findById(id);
      const { firstDate, totalIncome, totalSpending, moneyLeft } =
        await getLogInfo(id);
      _.assign(user, { firstDate, totalIncome, totalSpending, moneyLeft });
      return user || {};
    },
    me: async (parent, args, { me }) => {
      // console.log(`🚀 a ${me}`);
      if (!me) {
        return {};
      }
      const user = await models.User.findById(me.id);
      return user;
    },
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password, phone, address },
      {}
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
        isVerified: false,
        verificationCode: Math.floor(100000 + Math.random() * 900000),
        signUpDate: moment(),
        phone,
        address,
        role: "Client",
      });
      Email.sendVerifyEmail(email, user.verificationCode);
      return { token: createToken(user, "10m"), isSuccess: true };
    },

    signIn: async (parent, { email, password }, {}) => {
      const user = await models.User.findByLogin(email);

      // console.log({ username, user });
      if (!user) {
        throw new UserInputError("No user found with this login credentials.");
      }
      const isValid = await user.validatePassword(password);
      if (!isValid) {
        const forgotPassword = await models.User.findOne({
          forgotToken: password,
          resetPasswordExpires: { $gt: Date.now() },
        });
        if (forgotPassword) {
          return {
            token: createToken(user, "1h"),
            srp: true,
            isSuccess: true,
            user,
          };
        }
        throw new AuthenticationError("Invalid password.");
      }
      return {
        isSuccess: true,
        data: {
          token: createToken(user, "1h"),
          user,
        },
      };
    },

    updateUser: combineResolvers(
      isAuthenticated,
      async (parent, args, { me }) => {
        const { profileInput } = args;
        const user = await models.User.findByIdAndUpdate(
          me.id,
          { ...profileInput },
          { new: true }
        );
        return { isSuccess: !!user };
      }
    ),

    changePassword: combineResolvers(
      isAuthenticated,
      async (parent, { password, newPassword }, { me }) => {
        try {
          const user = await models.User.findById(me.id);
          const isValid = await user.validatePassword(password);
          if (!isValid) {
            throw new AuthenticationError("Invalid password.");
          }
          const userNewPassword = await models.User.findByIdAndUpdate(
            me.id,
            { password: newPassword },
            { new: true }
          );
          userNewPassword.save();

          return {
            token: createToken(userNewPassword, "1h"),
            isSuccess: true,
          };
        } catch (error) {
          return {
            isSuccess: false,
            message: `${error}`,
          };
        }
      }
    ),

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        const user = await models.User.findById(id);

        if (user) {
          await user.remove();
          return true;
        }
        return false;
      }
    ),

    verifiedEmail: combineResolvers(
      isAuthenticated,
      async (parent, { verificationCode }, { me }) => {
        try {
          const verified = await models.User.findOneAndUpdate(
            { verificationCode, _id: me.id },
            {
              isVerified: true,
              verificationCode: "",
            }
          );
          return {
            isSuccess: Boolean(verified),
          };
        } catch (error) {
          return {
            isSuccess: false,
            message: error,
          };
        }
      }
    ),

    resendVerifiedEmail: combineResolvers(
      isAuthenticated,
      async (parent, {}, { me }) => {
        const user = await models.User.findById(me.id);
        if (user.isVerified) {
          return {
            isSuccess: false,
            message: "Already verified!",
          };
        }
        Email.sendVerifyEmail(user.email, user.verificationCode);
        return { isSuccess: !!user };
      }
    ),

    forgotPassword: async (parent, { email }, {}) => {
      const user = await models.User.findOneAndUpdate(
        { email },
        {
          forgotToken: Math.floor(100000 + Math.random() * 900000),
          resetPasswordExpires: moment().add(1, "h"),
        },
        { new: true }
      );
      Email.sendForgotPassword(email, user.forgotToken);
      return {
        isSuccess: Boolean(user),
      };
    },

    resetPassword: async (parent, { verificationCode, password }, {}) => {
      try {
        const user = await models.User.findOne({
          forgotToken: verificationCode,
        });
        if (!user.forgotToken) {
          throw new AuthenticationError("Invalid verification code.");
        }
        const userNewPassword = await models.User.findByIdAndUpdate(
          user._id,
          {
            password,
            forgotToken: "",
            resetPasswordExpires: undefined,
          },
          { new: true }
        );
        userNewPassword.save();
        return {
          token: createToken(userNewPassword, "10m"),
          isSuccess: true,
        };
      } catch (error) {
        return {
          isSuccess: false,
          message: `${error}`,
        };
      }
    },
  },
};
