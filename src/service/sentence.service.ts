import { getLatestSentence } from "../repositories/sentence.repositories";

export const fetchLatestSentence = async () => {
  const sentence = await getLatestSentence();

  if (!sentence) {
    throw new Error("문장을 찾을 수 없습니다.");
  }

  const sentenceData = sentence.toObject();

  const newDate = new Date(sentenceData.date);

  const year = String(newDate.getFullYear()).slice(2);
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const day = String(newDate.getDate()).padStart(2, "0");

  const dayFormatted = `${year}.${month}.${day}`;

  return { ...sentenceData, dayFormatted };
};
