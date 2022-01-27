import mongoose from 'mongoose';

const expenditureSchema = new mongoose.Schema(
  {
    date: Date,
    title: {
      type: String,
      required: true,
    },
    spending: Number,
    detail: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const Expenditure = mongoose.model('Expenditure', expenditureSchema);

export default Expenditure;
