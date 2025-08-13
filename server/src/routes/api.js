import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

router.get("/conversations", async (_req, res) => {
  try {
    const pipeline = [
      { $sort: { timestamp: 1 } },
      { $group: {
          _id: "$wa_id",
          name: { $last: "$name" },
          lastMessage: { $last: "$text" },
          lastStatus: { $last: "$status" },
          lastTs: { $last: "$timestamp" }
        }
      },
      { $sort: { lastTs: -1 } }
    ];
    const convos = await Message.aggregate(pipeline);
    res.json(convos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/messages", async (req, res) => {
  try {
    const { wa_id } = req.query;
    const msgs = await Message.find({ wa_id }).sort({ timestamp: 1 }).lean();
    res.json(msgs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/messages", async (req, res) => {
  try {
    const body = req.body || {};
    const now = Date.now();
    const doc = await Message.create({
      meta_msg_id: body.meta_msg_id || "local_" + now,
      wa_id: body.wa_id,
      name: body.name || "You",
      from: body.from || "agent",
      to: body.to || body.wa_id,
      text: body.text,
      timestamp: Math.floor(now / 1000),
      status: "sent"
    });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/ingest/message", async (req, res) => {
  try {
    const p = req.body || {};
    const r = await Message.updateOne(
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
    res.json({ ok: true, result: r });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/ingest/status", async (req, res) => {
  try {
    const { id, status } = req.body || {};
    const r = await Message.updateOne({ meta_msg_id: id }, { $set: { status } });
    res.json({ ok: true, result: r });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
