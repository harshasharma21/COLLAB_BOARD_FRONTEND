import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import socket from "../socket";

const RoomPage = () => {
  const { state } = useLocation();
  const { username, room } = state || {};  // Added room info
  const canvasRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(""); // Stores the message being typed
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [eraserSize, setEraserSize] = useState(10);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let drawing = false;

    const startDrawing = (e) => {
      drawing = true;
      draw(e);
    };

    const endDrawing = () => {
      drawing = false;
      ctx.beginPath();
    };

    const draw = (e) => {
      if (!drawing) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.lineWidth = isEraser ? eraserSize : brushSize;
      ctx.lineCap = "round";
      ctx.strokeStyle = isEraser ? "#ffffff" : color;

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);

      socket.emit("drawing", {
        x,
        y,
        color: isEraser ? "#ffffff" : color,
        brushSize: isEraser ? eraserSize : brushSize,
      });
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", endDrawing);
    canvas.addEventListener("mousemove", draw);

    socket.on("drawing", ({ x, y, color, brushSize }) => {
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.strokeStyle = color;

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    });

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mouseup", endDrawing);
      canvas.removeEventListener("mousemove", draw);
    };
  }, [color, brushSize, isEraser, eraserSize]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { username, text: message };

      // Add the new message locally
      setMessages((prev) => [...prev, newMessage]);

      // Emit the message to the server
      socket.emit("message", newMessage);

      // Clear the input field
      setMessage("");
    }
  };

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prev) => {
        // Prevent duplicate messages from being added
        if (prev[prev.length - 1]?.text !== data.text) {
          return [...prev, data];
        }
        return prev;
      });
    };

    // Prevent duplicate listeners
    socket.off("message"); // Clear any existing listeners
    socket.on("message", handleMessage);

    return () => socket.off("message", handleMessage); // Cleanup on unmount
  }, []);

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center bg-blue-600 text-white py-3 px-6">
        <h1 className="text-2xl font-bold">Collaborative Whiteboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-white">Room: {room}</span>
          <button
            onClick={downloadCanvas}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          >
            Download Whiteboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Whiteboard Area */}
        <div className="flex flex-col items-center bg-white p-4 w-3/4">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-gray-300 shadow-lg"
          ></canvas>

          {/* Tools */}
          <div className="flex items-center space-x-4 mt-4">
            {/* Color Selector */}
            <div>
              <label className="mr-2">Brush Color:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={isEraser}
              />
            </div>

            {/* Brush Size Selector */}
            <div>
              <label className="mr-2">Brush Size:</label>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(e.target.value)}
                disabled={isEraser}
              />
            </div>

            {/* Eraser Toggle */}
            <button
              onClick={() => setIsEraser(!isEraser)}
              className={`px-4 py-2 rounded ${
                isEraser
                  ? "bg-red-500 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {isEraser ? "Disable Eraser" : "Enable Eraser"}
            </button>

            {/* Eraser Size Selector */}
            {isEraser && (
              <div>
                <label className="mr-2">Eraser Size:</label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={eraserSize}
                  onChange={(e) => setEraserSize(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-gray-200 p-4 w-1/4 flex flex-col">
          <h2 className="text-xl font-bold mb-2 text-blue-600">Chat</h2>
          <div className="flex-grow overflow-y-auto bg-white p-4 rounded shadow-md space-y-3">
            <div className="p-2 rounded bg-gray-100 shadow border border-gray-200">
              <strong className="text-blue-600">Hello, {username}!</strong>
              <p className="text-gray-500">You are in room: {room}</p>
            </div>
            {messages.map((msg, index) => (
              <div
                key={index}
                className="p-2 rounded bg-gray-100 shadow border border-gray-200"
              >
                <strong className="text-blue-600">{msg.username}:</strong>{" "}
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
