const express = require("express");
const router = express.Router();

const {
  createQueue,
  joinQueue
} = require("../controllers/queueController");

// test route
router.get("/test", (req, res) => {
  res.send("Queue route working ✅");
});

// main APIs
router.post("/create", createQueue);
router.post("/join/:code", joinQueue);

module.exports = router;