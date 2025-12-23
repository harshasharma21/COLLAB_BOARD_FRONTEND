const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // React app URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// Store room data
const rooms = {};
const canvasStates = {};
const userSockets = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", ({ username, room }) => {
    console.log(`${username} joined room ${room}`);
    
    // Store socket info
    socket.username = username;
    socket.room = room;
    userSockets[socket.id] = { username, room };

    // Join the socket to the room
    socket.join(room);

    // Initialize room if it doesn't exist
    if (!rooms[room]) {
      rooms[room] = [];
    }

    // Add user to participants list
    if (!rooms[room].includes(username)) {
      rooms[room].push(username);
    }

    //console.log(`Participants in ${room}:`, rooms[room]);

    // Broadcast user_joined to all users in the room
    io.to(room).emit("user_joined", {
      username: username,
      participants: rooms[room],
    });

    // Send current canvas state to the new user
    if (canvasStates[room]) {
      socket.emit("canvas_state", canvasStates[room]);
      //console.log(`Sent canvas state to ${username}`);
    }
  });

  socket.on("drawing", ({ x, y, color, brushSize, room }) => {
    // Broadcast drawing to all users in the room except sender
    socket.to(room).emit("drawing", { x, y, color, brushSize });
  });

  socket.on("canvas_update", ({ canvasImageData, room }) => {
    // Store canvas state for the room
    canvasStates[room] = canvasImageData;
    //console.log(`Canvas updated for room ${room}`);
  });

  socket.on("message", ({ username, text, room }) => {
    // Broadcast message to all users in the room
    io.to(room).emit("message", { username, text });
    //console.log(`Message from ${username} in ${room}: ${text}`);
  });

  socket.on("disconnect", () => {
    const userData = userSockets[socket.id];
    if (userData) {
      const { username, room } = userData;
      //console.log(`${username} disconnected from room ${room}`);

      // Remove user from room
      if (rooms[room]) {
        rooms[room] = rooms[room].filter((user) => user !== username);
        //console.log(`Updated participants in ${room}:`, rooms[room]);

        // Notify remaining users
        if (rooms[room].length > 0) {
          io.to(room).emit("participants_updated", rooms[room]);
        } else {
          // Delete room if empty
          delete rooms[room];
          delete canvasStates[room];
        }
      }
    }
    delete userSockets[socket.id];
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
