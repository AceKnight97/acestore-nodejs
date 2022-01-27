import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    ancestors: [String],
    parent: { type: String, ref: 'Category' },
    isActive: { type: Boolean, default: true, required: true },
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    icon: String,
    isDefault: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
