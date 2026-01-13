import { findRandomComments } from "../repositories/comment.repositories";
import { getIO } from "../socket";

// 새로 등록된 코멘트 대기열 (최우선 방송용)
let newCommentQueue: any[] = [];

// 최근 나온 코멘트 ID 기록 (중복 방지용, 최대 2개 유지)
let recentCommentIds: string[] = [];
const MAX_RECENT_HISTORY = 2;

/**
 * 최근 나온 코멘트 ID 기록
 */
const addToRecentHistory = (commentId: string) => {
  recentCommentIds.push(commentId);
  // 최대 2개만 유지
  if (recentCommentIds.length > MAX_RECENT_HISTORY) {
    recentCommentIds.shift();
  }
};

/**
 * 새 코멘트를 대기열에 추가 (3초 뒤 우선 노출)
 */
export const queueNewComment = (comment: any) => {
  newCommentQueue.push(comment);
  console.log(
    `📝 새 코멘트 대기열 추가: "${comment.content.substring(
      0,
      20
    )}..." (대기열: ${newCommentQueue.length}개)`
  );
};

/**
 * 랜덤 코멘트 브로드캐스트 (새 코멘트 우선, 최근 코멘트 제외)
 */
export const broadcastRandomComment = async () => {
  try {
    let comment;

    // 새 코멘트 대기열이 있으면 우선 사용
    if (newCommentQueue.length > 0) {
      comment = newCommentQueue.shift();
    } else {
      // 대기열이 비어있으면 DB에서 랜덤 조회 (최근 코멘트 제외)
      comment = await findRandomComments(recentCommentIds);
    }

    if (comment) {
      const io = getIO();
      io.emit("random_comment", comment);

      // 최근 기록에 추가
      const commentId = comment._id?.toString() || comment.id;
      if (commentId) {
        addToRecentHistory(commentId);
      }
    }
  } catch (error) {
    console.error("랜덤 댓글 방송 중 오류 발생:", error);
  }
};
