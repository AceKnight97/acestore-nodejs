const { combineResolvers } = require("graphql-resolvers");
const { AuthenticationError, UserInputError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const moment = require("moment");
const Email = require("../helper");
// const sendSMS = require("../helper/sendSMS");
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

module.exports = {
  Query: {
    users: combineResolvers(isAuthenticated, async (parent, args, { me }) => {
      if (me.role === "Admin") {
        const users = await models.User.find();
        return users || [];
      }
      return [];
    }),
    user: combineResolvers(isAuthenticated, async (parent, { id }, { me }) => {
      if (me.role === "Admin") {
        const user = await models.User.findById(id);
        return user || {};
      }
      return {};
    }),
    me: async (parent, args, { me }) => {
      if (!me) {
        return {};
      }
      const user = await models.User.findById(me.id);
      return user;
    },
  },

  Mutation: {
    signUp: async (parent, { password, phone, address }, {}) => {
      // username, email,
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      // sendSMS(
      //   process.env.TWILIO_PHONE_NUMBER,
      //   phone,
      //   `Thanks for signing up. Please use the Code: ${verificationCode} to verify account!`
      // );
      try {
        const isExisted = models.User.findOne({ phone });
        if (isExisted) {
          return { token: "", isSuccess: false };
        }
        const user = await models.User.create({
          phone,
          password,
          signUpDate: moment(),
          address,
          isVerified: false,
          role: "Client",
          verificationCode,
        });
        // Email.sendVerifyEmail(email, user.verificationCode);
        return { token: createToken(user, "10m"), isSuccess: true };
      } catch (error) {
        console.log({ error });
        return { token: "", isSuccess: false };
      }
    },

    signIn: async (parent, { phone, password }, {}) => {
      const user = await models.User.findOne({ phone });

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

    testSendSMS: async (parent, { phone }, {}) => {
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      // await sendSMS(
      //   phone,
      //   `Thanks for signing up. Please use the Code: ${verificationCode} to verify account!`
      // );
      // `Thanks for signing up. Please use the Code: ${verificationCode} to verify account!`
      return { isSuccess: true };
    },

    updateUser: combineResolvers(
      isAuthenticated,
      async (parent, { profileInput }, { me }) => {
        // { email, username, address, gender, dob }
        const updateObj = {};
        Object.keys(profileInput).forEach((x) => {
          if (
            !_.isEmpty(profileInput[x]) ||
            (x === "dob" && profileInput.dob)
          ) {
            _.assign(updateObj, { [x]: profileInput[x] });
          }
        });
        const user = await models.User.findByIdAndUpdate(me.id, updateObj, {
          new: true,
        });
        return { isSuccess: !!user, user };
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
        const res = await Email.sendVerifyEmail(
          user.email,
          user.verificationCode
        );
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
