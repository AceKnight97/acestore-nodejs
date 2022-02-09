const mongoose = require("mongoose");

const foodOrderSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    email: {
      type: String,
    },
    notes: {
      type: String,
    },
    destination: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
  },
  {
    timestamps: true,
  }
);

const FoodOrder = mongoose.model("FoodOrder", foodOrderSchema);

module.exports = { FoodOrder };
