import mongoose from 'mongoose';

const userSpendingSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    iso: {
      type: Date,
      required: true,
    },
    utc: {
      type: Date,
      required: true,
    },
    logs: [
      {
        _id: false,
        title: String,
        money: Number,
        details: String,
      }
    ],
    income: Number,
    notes: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const UserSpending = mongoose.model('UserSpending', userSpendingSchema);

export default UserSpending;
