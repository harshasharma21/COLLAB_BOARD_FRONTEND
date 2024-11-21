import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const joinRoom = () => {
    if (username && room) {
      navigate(`/room/${room}`, { state: { username } });
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-r from-purple-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">THINKBOARD</h1>
        <input
          type="text"
          placeholder="Enter your username"
          className="w-full mb-4 p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Room ID"
          className="w-full mb-4 p-2 border rounded"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button
          onClick={joinRoom}
          className="bg-blue-500 w-full text-white py-2 rounded hover:bg-blue-600"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
