# Backend Socket.IO Events Required

Your backend needs to handle the following socket events for the new features to work:

## Events to Listen For (Server should handle these):

### 1. `join_room`
- **Emitted by:** Client when user joins
- **Data:** `{ username, room }`
- **Action:** 
  - Add user to room
  - Broadcast `user_joined` to all users in room
  - Send `canvas_state` with current drawing to the joining user
  - Update participants list

### 2. `drawing`
- **Emitted by:** Client when drawing
- **Data:** `{ x, y, color, brushSize, room }`
- **Action:** Broadcast to all other users in the room

### 3. `canvas_update`
- **Emitted by:** Client every 5 seconds
- **Data:** `{ canvasImageData, room }`
- **Action:** Store the canvas state (image data) for the room

### 4. `message`
- **Emitted by:** Client when sending chat message
- **Data:** `{ username, text }`
- **Action:** Broadcast to all users in the room

## Events to Emit (Server should emit these):

### 1. `user_joined`
- **Emitted to:** All users in the room
- **Data:** `{ username: "username", participants: ["user1", "user2", ...] }`
- **Purpose:** Notify all users that someone joined

### 2. `participants_updated`
- **Emitted to:** All users in the room
- **Data:** Array of participant usernames `["user1", "user2", ...]`
- **Purpose:** Update participant list

### 3. `canvas_state`
- **Emitted to:** Newly joined user only
- **Data:** Canvas image data (base64 string)
- **Purpose:** Show existing drawing to new user

### 4. `drawing`
- **Emitted to:** All users except sender in the room
- **Data:** `{ x, y, color, brushSize }`
- **Purpose:** Real-time drawing sync

### 5. `message`
- **Emitted to:** All users in the room
- **Data:** `{ username, text }`
- **Purpose:** Chat message broadcast

## Example Backend Implementation (Node.js with Socket.IO):

```javascript
// Store canvas state per room
const canvasStates = {};
// Store participants per room
const roomParticipants = {};

io.on('connection', (socket) => {
  socket.on('join_room', ({ username, room }) => {
    socket.join(room);
    
    // Initialize room if first user
    if (!roomParticipants[room]) {
      roomParticipants[room] = [];
    }
    
    // Add user to participants
    roomParticipants[room].push(username);
    
    // Notify all users in room
    io.to(room).emit('user_joined', {
      username,
      participants: roomParticipants[room]
    });
    
    // Send existing canvas to new user
    if (canvasStates[room]) {
      socket.emit('canvas_state', canvasStates[room]);
    }
  });

  socket.on('drawing', ({ x, y, color, brushSize, room }) => {
    socket.to(room).emit('drawing', { x, y, color, brushSize });
  });

  socket.on('canvas_update', ({ canvasImageData, room }) => {
    canvasStates[room] = canvasImageData;
  });

  socket.on('message', (message) => {
    // Assuming room info is available via socket.rooms
    const room = Array.from(socket.rooms)[1]; // First element is socket.id
    io.to(room).emit('message', message);
  });

  socket.on('disconnect', () => {
    // Remove user from all rooms
    for (let room in roomParticipants) {
      roomParticipants[room] = roomParticipants[room].filter(user => user !== username);
      if (roomParticipants[room].length === 0) {
        delete roomParticipants[room];
        delete canvasStates[room];
      } else {
        io.to(room).emit('participants_updated', roomParticipants[room]);
      }
    }
  });
});
```

## Key Implementation Notes:

1. **Canvas Persistence**: Store canvas image data as base64 string in memory or database
2. **Participants Tracking**: Keep a list of users per room
3. **Room Management**: Use socket.io's room feature to broadcast to specific rooms
4. **Message Broadcasting**: Broadcast drawing events to all users except sender for efficiency
5. **Cleanup**: Remove participants when they disconnect and notify others
