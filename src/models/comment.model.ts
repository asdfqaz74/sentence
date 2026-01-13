import mongoose, { Document, Model, Schema } from "mongoose";

export interface IComment extends Document {
  content: string;
  date: string;
}

const CommentSchema = new Schema({
  content: { type: String, required: true },
  date: {
    type: String,
    default: () => {
      const now = new Date();
      const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);

      const hours = kstDate.getUTCHours();
      const minutes = kstDate.getUTCMinutes();

      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // 한 자리 수 시간일 때 0 제거 (예: 2:15)
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

      return `${ampm} ${formattedHours}:${formattedMinutes}`;
    },
  },
});

export const Comment: Model<IComment> = mongoose.model<IComment>(
  "Comment",
  CommentSchema
);
