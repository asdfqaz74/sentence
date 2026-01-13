import { Comment } from "../models/comment.model";
import mongoose from "mongoose";

export const saveComment = async (data: string) => {
  const comment = new Comment({ content: data });
  return await comment.save();
};

/**
 * 랜덤 코멘트 조회 (최근 나온 코멘트 제외)
 * @param excludeIds - 제외할 코멘트 ID 배열
 */
export const findRandomComments = async (excludeIds: string[] = []) => {
  // 전체 코멘트 수 확인
  const totalCount = await Comment.countDocuments();

  // 3개 미만이면 제외 없이 랜덤 조회
  if (totalCount < 3) {
    const result = await Comment.aggregate([{ $sample: { size: 1 } }]);
    return result.length > 0 ? result[0] : null;
  }

  // 3개 이상이면 최근 나온 코멘트 제외
  const excludeObjectIds = excludeIds.map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  const result = await Comment.aggregate([
    { $match: { _id: { $nin: excludeObjectIds } } },
    { $sample: { size: 1 } },
  ]);

  return result.length > 0 ? result[0] : null;
};
