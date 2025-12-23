import { io } from "socket.io-client";

// Determine backend URL based on environment
const backendUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_URL
    : "http://localhost:5000";

const socket = io(backendUrl);
export default socket;
