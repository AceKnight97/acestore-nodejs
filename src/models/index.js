import mongoose from "mongoose";

import User from "./user";
import Setting from "./setting";
import UserSpending from "./userSpending";
// import Message from "./message";
// import Expenditure from "./expenditure";
// import Category from "./category";

const connectDb = () => {
  if (process.env.TEST_DATABASE_URL) {
    return mongoose.connect(process.env.TEST_DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  if (process.env.DATABASE_URL) {
    return mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  }
  throw new Error("missing db url");
};

const models = {
  User,
  Setting,
  UserSpending,
  // Message,
  // Expenditure,
  // Category,
};

export { connectDb };

export default models;
