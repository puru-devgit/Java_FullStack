const Queue = require("./models/Queue");
console.log("Queue model loaded:", Queue.modelName);
console.log("STARTING FLOWQ SERVER...");

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());


mongoose.connect("mongodb://127.0.0.1:27017/flowq")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error:", err));


app.get("/", (req, res) => {
  res.send("FlowQ server running 🚀");
});


app.listen(5001, () => {
  console.log("Server running on port 5001");
});