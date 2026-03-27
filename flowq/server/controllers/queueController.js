// In-memory storage (temporary for now)
let queues = [];

// CREATE QUEUE
exports.createQueue = (req, res) => {
  const { organizationName, queueType, phoneNumber } = req.body;

  // validation
  if (!organizationName || !queueType || !phoneNumber) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const queueCode = Math.random().toString(36).substring(2, 8);

  const newQueue = {
    queueCode,
    organizationName,
    queueType,
    phoneNumber,
    users: []
  };

  queues.push(newQueue);

  res.json(newQueue);
};

// JOIN QUEUE
exports.joinQueue = (req, res) => {
  const { code } = req.params;

  const queue = queues.find(q => q.queueCode === code);

  if (!queue) {
    return res.status(404).json({ error: "Queue not found" });
  }

  const userId = Math.random().toString(36).substring(2, 9);

  queue.users.push({ userId });

  res.json({
    message: "Joined successfully",
    userId,
    position: queue.users.length
  });
};