const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3
    },

    description: {
      type: String
    },

    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo"
    },

    completedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
