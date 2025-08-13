import fs from "fs";
import path from "path";
import "dotenv/config";
import mongoose from "mongoose";
import Message from "../src/models/Message.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/whatsapp";
const PAYLOAD_DIR = path.resolve(process.cwd(), "../payloads");

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: "whatsapp" });
  console.log("Connected to MongoDB");

  const files = fs.readdirSync(PAYLOAD_DIR).filter(f => f.endsWith(".json")).sort();
  for (const f of files) {
    const full = path.join(PAYLOAD_DIR, f);
    const p = JSON.parse(fs.readFileSync(full, "utf8"));
    if (f.includes("message")) {
      if (!p.meta_msg_id) continue;
      await Message.updateOne(
        { meta_msg_id: p.meta_msg_id },
        {
          $setOnInsert: {
            wa_id: p.wa_id,
            name: p.name,
            from: p.from,
            to: p.to,
            message_type: p.message_type || "text",
            text: p.text,
            timestamp: p.timestamp || Math.floor(Date.now()/1000),
            status: "sent"
          }
        },
        { upsert: true }
      );
      console.log("Upserted message", p.meta_msg_id);
    } else if (f.includes("status")) {
      if (!p.id || !p.status) continue;
      await Message.updateOne({ meta_msg_id: p.id }, { $set: { status: p.status } });
      console.log("Updated status", p.id, "=>", p.status);
    }
  }

  console.log("Processing complete");
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
