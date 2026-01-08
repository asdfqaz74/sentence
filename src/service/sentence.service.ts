import {
  getLatestSentence,
  getSentencesByPeriod,
} from "../repositories/sentence.repositories";

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

export const fetchWeeklySentences = async () => {
  const now = new Date();
  // DB에 저장된 시간은 KST(UTC+9) 기준이므로, 현재 시간도 KST 기준으로 변환하여 계산
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  const currentDay = kstNow.getUTCDay(); // 0(일) ~ 6(토)
  // 일요일(0)을 7로 처리하여 월(1) ~ 일(7)로 계산 (주말에 실행 시 이번주 평일을 가져오기 위함)
  const dayIndex = currentDay === 0 ? 7 : currentDay;

  // 이번 주 월요일 00:00:00 계산
  const monday = new Date(kstNow);
  monday.setUTCDate(kstNow.getUTCDate() - (dayIndex - 1));
  monday.setUTCHours(0, 0, 0, 0);

  // 이번 주 금요일 23:59:59 계산
  const friday = new Date(monday);
  friday.setUTCDate(monday.getUTCDate() + 4);
  friday.setUTCHours(23, 59, 59, 999);

  const sentences = await getSentencesByPeriod(monday, friday);

  if (!sentences || sentences.length === 0) {
    throw new Error("이번 주 평일에 생성된 문장이 없습니다.");
  }

  // 여러 날짜의 문장 배열(doc.sentence)을 하나의 배열로 평탄화(flat)
  const mergedSentences = sentences.flatMap((doc) => doc.sentence);

  const length = mergedSentences.length;

  const data = {
    totalCount: length,
    sentence: mergedSentences,
  };

  // date 없이 sentence 키 안에 모든 문장을 담아서 반환
  return data;
};
