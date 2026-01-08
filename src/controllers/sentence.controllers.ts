import { Request, Response } from "express";
import {
  fetchLatestSentence,
  fetchWeeklySentences,
} from "../service/sentence.service";

export const getLatestSentenceController = async (
  req: Request,
  res: Response
) => {
  try {
    const { dayFormatted, ...sentenceData } = await fetchLatestSentence();

    res.status(200).json({
      success: true,
      message: `${dayFormatted}일자 최신 문장 5개를 불러왔습니다.`,
      data: sentenceData,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};

export const getWeeklySentences = async (req: Request, res: Response) => {
  try {
    const sentences = await fetchWeeklySentences();

    res.status(200).json({
      success: true,
      message: "이번 주 평일에 생성된 문장들을 불러왔습니다.",
      data: sentences,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};
