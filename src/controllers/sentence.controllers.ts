import { Request, Response } from "express";
import { fetchLatestSentence } from "../service/sentence.service";

export const getLatestSentenceController = async (
  req: Request,
  res: Response
) => {
  try {
    // service에서 받아온 객체에서 dayFormatted와 나머지 데이터를 분리합니다.
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
