import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
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
    icon: {
      type: String,
      default: "wallet-outline",
    },
    color: {
      type: String,
      default: "#6366F1",
    },
  },
  {
    timestamps: true,
  }
);

expenseSchema.index({ userId: 1, month: 1, year: 1 });

export default mongoose.model("Expense", expenseSchema);
