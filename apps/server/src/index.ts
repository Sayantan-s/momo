import { Server } from "socket.io";

const io = new Server(5001, {
  cors: {
    origin: "*",
  },
});

console.log("📡 Socket.IO server started on ws://localhost:5001");

io.on("connection", (socket) => {
  console.log("✅ Client connected");

  socket.on("redux-update", (state) => {
    console.log("🟢 Updated Redux State:");
    const reduxState = JSON.parse(JSON.stringify(state));
    delete reduxState.api;
    io.emit("redux-update", reduxState);
  });

  socket.on("disconnect", () => console.log("❌ Client disconnected"));
});
