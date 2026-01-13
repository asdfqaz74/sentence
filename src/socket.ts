import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { broadcastRandomComment } from "./service/comment.service";

let io: SocketIOServer | null = null;
let activeUsers = 0;

/**
 * 3초마다 랜덤 코멘트 브로드캐스트 (접속자 있을 때만)
 */
const startRandomCommentTimer = () => {
  setInterval(() => {
    // 접속자가 0명일 때는 DB 조회 스킵 (최적화)
    if (activeUsers > 0) {
      broadcastRandomComment();
    }
  }, 3000);
};

/**
 * Socket.IO 서버 초기화 및 이벤트 핸들러 설정
 * @param httpServer - HTTP 서버 인스턴스
 */
export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // 프로덕션에서는 특정 도메인으로 제한하세요
      methods: ["GET", "POST"],
    },
  });

  // Socket.IO 이벤트 처리
  io.on("connection", (socket: Socket) => {
    // 새로운 사용자 연결
    activeUsers++;
    console.log(
      `✅ 사용자 연결됨 (ID: ${socket.id}) | 현재 접속자: ${activeUsers}명`
    );

    // 모든 클라이언트에게 현재 사용자 수 전송
    io!.emit("activeUsers", { count: activeUsers });

    // 연결 해제
    socket.on("disconnect", () => {
      activeUsers--;
      console.log(
        `❌ 사용자 연결 해제됨 (ID: ${socket.id}) | 현재 접속자: ${activeUsers}명`
      );

      // 모든 클라이언트에게 업데이트된 사용자 수 전송
      io!.emit("activeUsers", { count: activeUsers });
    });

    // 클라이언트가 현재 사용자 수를 요청할 때
    socket.on("getUserCount", () => {
      socket.emit("activeUsers", { count: activeUsers });
    });
  });

  // 3초마다 랜덤 코멘트 브로드캐스트 타이머 시작
  startRandomCommentTimer();

  return io;
};

/**
 * Socket.IO 인스턴스 반환 (다른 모듈에서 사용)
 */
export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io가 초기화되지 않았습니다!");
  }
  return io;
};

/**
 * 현재 접속자 수 반환
 */
export const getActiveUsers = (): number => {
  return activeUsers;
};
