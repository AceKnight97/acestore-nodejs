const mongoose = require("mongoose");

const bookedScheduleSchema = new mongoose.Schema(
  {
    bookDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    phone: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const BookedSchedule = mongoose.model("BookedSchedule", bookedScheduleSchema);

module.exports = { BookedSchedule };
