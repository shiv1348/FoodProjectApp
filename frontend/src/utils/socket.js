import { io } from "socket.io-client";

// Connect to backend server dynamically
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:8080");

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export default socket;
