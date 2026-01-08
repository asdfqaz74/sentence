import { Sentence, ISentenceDocument } from "../models/sentence.model";

export const getLatestSentence =
  async (): Promise<ISentenceDocument | null> => {
    return await Sentence.findOne().sort({ date: -1 }).select("-__v -_id");
  };
