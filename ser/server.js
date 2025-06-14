const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
});

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rooms = {};
app.get('/rooms', (req, res) => {
  return res.json(rooms);
});

app.post('/room', (req, res) => {
  const roomName = req.body.room;
  if (!roomName) {
    return res.status(400).json({ success: false, error: 'No room name provided' });
  }
  if (rooms[roomName] != null) {
    return res.json({ success: false, error: 'Room already exists' });
  }
  rooms[roomName] = { users: {} };
  io.emit('room-created', roomName);
  return res.json({ success: true, room: roomName });
});


server.listen(process.env.PORT || 3000, () => console.log('Server running on port 3000'));

io.on('connection', socket => {
  console.log('New socket connection:', socket.id);
  
  socket.on('new-user', (room, name) => {
    socket.join(room);
    rooms[room].users[socket.id] = name;
    console.log(`${name} joined room ${room}`);
    socket.broadcast.to(room).emit('user-connected', name);
  });

  socket.on('send-chat-message', (room, message) => {
    const sender = rooms[room] && rooms[room].users[socket.id] ? rooms[room].users[socket.id] : 'Unknown';
    console.log(`Message from ${sender} in room ${room}: ${message}`);
    socket.broadcast.to(room).emit('chat-message', {
      message: message,
      name: sender
    });
  });

  socket.on('disconnect', () => {
    Object.entries(rooms).forEach(([roomName, room]) => {
      if (room.users[socket.id]) {
        const userName = room.users[socket.id];
        socket.broadcast.to(roomName).emit('user-disconnected', userName);
        delete room.users[socket.id];
        console.log(`${userName} disconnected from room ${roomName}`);
      }
    });
  });
});
