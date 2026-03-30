const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const webpush = require('web-push');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] }
});

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Configure web-push
webpush.setVapidDetails(
  'mailto:admin@flowq.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
app.set('webpush', webpush);

// Make io accessible in routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/org', require('./routes/organization.js'));
app.use('/api/queue', require('./routes/queue.js'));
app.use('/api/push', require('./routes/push.js'));

// Socket.IO
io.on('connection', (socket) => {
  socket.on('join_org_room', (orgId) => socket.join(`org_${orgId}`));
  socket.on('join_client_room', (clientId) => socket.join(`client_${clientId}`));
  socket.on('disconnect', () => {});
});

// Connect DB & Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () =>
      console.log(`FlowQ server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('MongoDB error:', err));