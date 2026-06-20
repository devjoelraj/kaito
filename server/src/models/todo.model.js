import mongoose from "mongoose";
const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["first", "second", "least"],
      default: "second",
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model("Todo", todoSchema);
