import mongoose, { Document, Schema, Model } from "mongoose";

export interface IWord {
  en: string;
  ko: string;
}

export interface ISentence {
  en: string;
  ko: string;
  words: IWord[];
}

export interface ISentenceDocument extends Document {
  sentence: ISentence[];
  date: Date;
}

const SentenceSchema: Schema = new Schema({
  sentence: { type: Array, required: true },
  date: {
    type: Date,
    default: () => {
      const now = new Date();
      // KST (UTC+9) 저장
      return new Date(now.getTime() + 9 * 60 * 60 * 1000);
    },
  },
});

export const Sentence: Model<ISentenceDocument> =
  mongoose.model<ISentenceDocument>("Sentence", SentenceSchema);
