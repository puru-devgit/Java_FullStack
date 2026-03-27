const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("FlowQ backend running 🚀");
});

// import routes
const queueRoutes = require("./routes/queueRoutes");

// use routes
app.use("/api/queue", queueRoutes);

// start server
app.listen(5001, () => {
  console.log("Server running on port 5001");
});