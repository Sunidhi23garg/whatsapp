import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";
import { connectDB } from "./db.js";
import apiRoutes from "./routes/api.js";
import Message from "./models/Message.js";

import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || "*" }));

app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  app.listen(5000, () => console.log("Server running on http://localhost:5000"));
})
.catch(err => console.error(err));

app.get("/", (_req, res) => res.json({ ok: true, service: "whatsapp-server-local" }));
app.use("/api", apiRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_ORIGIN?.split(",") || "*" } });

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
});

Message.schema.post("save", function (doc) {
  io.emit("message:new", doc.toObject());
});
Message.schema.post("findOneAndUpdate", function (doc) {
  if (doc) io.emit("message:update", doc.toObject());
});
Message.schema.post("updateOne", function () {
  io.emit("message:bump");
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/whatsapp";

connectDB(MONGODB_URI).then(() => {
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("DB connection failed:", err);
  process.exit(1);
});
