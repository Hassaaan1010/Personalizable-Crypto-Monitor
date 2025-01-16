import mongoose from "mongoose";

const triggerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coin: {
    type: String,
    required: true,
  },
  maxLimit: {
    type: Number,
    required: true,
  },
  minLimit: {
    type: Number,
    required: true,
  },
  activated: {
    type: Boolean,
    default: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Trigger = mongoose.model("Trigger", triggerSchema);

export default Trigger;
