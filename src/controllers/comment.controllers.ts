import { Request, Response } from "express";
import { saveComment } from "../repositories/comment.repositories";
import { queueNewComment } from "../service/comment.service";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      res.status(400).json({ error: "코멘트 내용을 입력해주세요." });
      return;
    }

    const comment = await saveComment(content.trim());

    // 새 코멘트를 대기열에 추가 (다음 3초 타이머 때 우선 노출)
    queueNewComment(comment);

    res.status(201).json({
      success: true,
      message: "코멘트가 등록되었습니다.",
    });
  } catch (error) {
    console.error("코멘트 저장 중 오류:", error);
    res.status(500).json({ error: "코멘트 저장에 실패했습니다." });
  }
};
