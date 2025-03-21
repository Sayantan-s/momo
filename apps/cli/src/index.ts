import { io } from "socket.io-client";

const socket = io("ws://localhost:5001");

socket.on("connect", () => {
  console.log("📡 Connected to Redux state stream");
});

socket.on("redux-update", (state) => {
  console.clear();
  console.log("🔄 Redux State Updated:");
  console.log(state);
});

socket.on("disconnect", () => {
  console.log("❌ Connection lost");
});
