import dotenv from "dotenv";

dotenv.config();

import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import connectDB from "./config/db";

const PORT = process.env.PORT || 3000;

connectDB();

// HTTP 서버 생성 (Express 앱과 통합)
const httpServer = createServer(app);

// Socket.IO 서버 생성
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*", // 프로덕션에서는 특정 도메인으로 제한하세요
    methods: ["GET", "POST"],
  },
});

// 실시간 사용자 수 추적
let activeUsers = 0;

// Socket.IO 이벤트 처리
io.on("connection", (socket) => {
  // 새로운 사용자 연결
  activeUsers++;
  // console.log(
  //   `✅ 사용자 연결됨 (ID: ${socket.id}) | 현재 접속자: ${activeUsers}명`
  // );

  // 모든 클라이언트에게 현재 사용자 수 전송
  io.emit("activeUsers", { count: activeUsers });

  // 연결 해제
  socket.on("disconnect", () => {
    activeUsers--;
    console.log(
      `❌ 사용자 연결 해제됨 (ID: ${socket.id}) | 현재 접속자: ${activeUsers}명`
    );

    // 모든 클라이언트에게 업데이트된 사용자 수 전송
    io.emit("activeUsers", { count: activeUsers });
  });

  // 클라이언트가 현재 사용자 수를 요청할 때
  socket.on("getUserCount", () => {
    socket.emit("activeUsers", { count: activeUsers });
  });
});

// HTTP 서버 시작 (Express + Socket.IO)
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 WebSocket server is ready`);
});

export { io };
