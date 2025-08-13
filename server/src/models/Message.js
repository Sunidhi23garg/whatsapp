import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    meta_msg_id: { type: String, index: true, unique: true, sparse: true },
    wa_id: { type: String, index: true },
    name: String,
    from: String,
    to: String,
    message_type: { type: String, default: "text" },
    text: String,
    timestamp: Number,
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent", index: true }
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema, "processed_messages");
