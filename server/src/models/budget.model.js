import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },

    limit: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false },
);

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    monthlyLimit: {
      type: Number,
      required: true,
      default: 0,
    },

    categories: [categorySchema],
  },
  {
    timestamps: true,
  },
);

budgetSchema.index(
  {
    userId: 1,
    month: 1,
    year: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.model("Budget", budgetSchema);
