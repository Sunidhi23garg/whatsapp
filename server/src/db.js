import mongoose from "mongoose";

export async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: "whatsapp" });
  console.log("MongoDB connected");
  console.log("Socket connected");
  return mongoose.connection;
}
