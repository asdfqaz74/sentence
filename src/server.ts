import dotenv from "dotenv";

dotenv.config();

import { createServer } from "http";
import app from "./app";
import connectDB from "./config/db";
import { initSocket } from "./socket";

const PORT = process.env.PORT || 3000;

connectDB();

// HTTP 서버 생성 (Express 앱과 통합)
const httpServer = createServer(app);

// Socket.IO 초기화
initSocket(httpServer);

// HTTP 서버 시작 (Express + Socket.IO)
httpServer.listen(PORT, () => {
  console.log(`🚀 서버 ${PORT}번에서 실행 중`);
  console.log(`📡 WebSocket 서버 준비 완료`);
});
