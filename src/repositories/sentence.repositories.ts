import { Sentence, ISentenceDocument } from "../models/sentence.model";

export const getLatestSentence =
  async (): Promise<ISentenceDocument | null> => {
    return await Sentence.findOne().sort({ date: -1 }).select("-__v -_id");
  };

export const getSentencesByPeriod = async (
  startDate: Date,
  endDate: Date
): Promise<ISentenceDocument[]> => {
  return await Sentence.find({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .sort({ date: 1 }) // 월~금 순서대로 정렬
    .select("-__v -_id");
};
