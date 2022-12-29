const mongoose = require("mongoose");

const popupScheduleSchema = new mongoose.Schema(
  {
    fromDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    toDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    streetName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    addressImg: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const PopupSchedule = mongoose.model("PopupSchedule", popupScheduleSchema);

module.exports = { PopupSchedule };
