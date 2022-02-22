/* eslint-disable func-names */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const isEmail = require("validator/lib/isEmail");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    validate: [isEmail, "No valid email address provided."],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },

  // NEW
  status: {
    type: String,
  },
  gender: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  dob: {
    type: Date,
  },
  signUpDate: {
    type: Date,
  },

  // END NEW

  isVerified: {
    type: Boolean,
  },
  verificationCode: {
    type: String,
  },
  forgotToken: {
    type: String,
  },
  resetPasswordExpires: {
    Date,
  },
  foodOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodOrder",
  },
});

userSchema.statics.findByLogin = async function (username) {
  let user = await this.findOne({
    username: username,
  });

  if (!user) {
    user = await this.findOne({ email: username });
  }

  return user;
};

userSchema.pre("remove", function (next) {
  this.model("Message").deleteMany({ userId: this._id }, next);
});

userSchema.pre("save", async function () {
  this.password = await this.generatePasswordHash();
});

userSchema.methods.generatePasswordHash = async function () {
  const saltRounds = 10;
  const result = await bcrypt.hash(this.password, saltRounds);
  return result;
};

userSchema.methods.validatePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
