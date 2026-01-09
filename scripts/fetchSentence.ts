import mongoose from "mongoose";
import dotenv from "dotenv";
import OpenAI from "openai";
import { Sentence } from "../src/models/sentence.model";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 한국 시간 타임스탬프 생성
const getKSTTimestamp = (): string => {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace("T", " ").substring(0, 19);
};

// 로그 출력 함수
const log = (message: string): void => {
  console.log(`[${getKSTTimestamp()}] ${message}`);
};

const logError = (message: string, error?: unknown): void => {
  console.error(`[${getKSTTimestamp()}] ❌ ${message}`);
  if (error) console.error(error);
};

async function fetchSentences(): Promise<void> {
  const startTime = Date.now();
  log("🚀 문장 생성 스크립트 시작");

  try {
    // 1. 환경 변수 검증
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI가 .env 파일에 정의되지 않았습니다");
    }
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY가 .env 파일에 정의되지 않았습니다");
    }

    // 2. MongoDB 연결
    await mongoose.connect(process.env.MONGO_URI);
    log("✅ MongoDB 연결됨");

    // 3. 어제자 문장 조회
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0));
    const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999));

    const yesterdaySentences = await Sentence.findOne({
      date: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd,
      },
    }).lean();

    let excludeSentencesText = "";
    if (yesterdaySentences && yesterdaySentences.sentence) {
      const sentenceList = yesterdaySentences.sentence
        .map((s: any) => `- ${s.en}`)
        .join("\n");
      excludeSentencesText = `\n\n**IMPORTANT: Do NOT generate any of the following sentences from yesterday:**\n${sentenceList}\n`;
      log(`📋 어제자 문장 ${yesterdaySentences.sentence.length}개 조회 완료`);
    } else {
      log("📋 어제자 문장 없음");
    }

    // 4. OpenAI API 호출
    const prompt = `
You are an English tutor who understands natural, real-life spoken English used by native speakers.

Please generate 5 unique English sentences for daily English practice, following ALL of the rules below:

1. Difficulty level must be CEFR B1–B2.
2. Sentences must sound natural and be immediately usable in everyday conversation.
3. Each sentence must be 60 characters or less in length.
4. Each sentence must include at least one commonly used, essential spoken expression or core vocabulary item.
5. Grammar usage must vary across the 5 sentences, such as:
   - different tenses
   - modal verbs
   - conditionals
   - comparisons
   - cause-and-effect expressions
   - opinions or preferences
6. Avoid textbook-style language. Use the tone, rhythm, and phrasing that native speakers actually use.
7. Focus on real-life situations such as travel, daily life, work, relationships, and emotional expression.
8. The overall goal is that consistent study of these sentences enables clear self-expression abroad.${excludeSentencesText}
For EACH sentence:
- Provide a natural Korean translation.
- Select exactly 2 key words or expressions that are essential in real conversation.
- Provide Korean translations for those key words.

Return the result STRICTLY as a JSON object with a "definitions" key containing an array.

The format MUST be exactly like the example below (no extra text):

{
  "definitions": [
    {
      "ko": "저 공룡은 엄청나게 커!",
      "en": "That dinosaur is ginormous!",
      "words": [
        { "en": "dinosaur", "ko": "공룡" },
        { "en": "ginormous", "ko": "엄청나게 큰" }
      ]
    }
  ]
}
`;

    log("📡 OpenAI API 요청 중...");
    const completion = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message?.content;
    if (!content) {
      throw new Error("OpenAI로부터 응답을 받지 못했습니다");
    }

    const parsedData = JSON.parse(content);
    const sentencesData = parsedData.definitions;

    if (!sentencesData || sentencesData.length === 0) {
      throw new Error("생성된 문장이 없습니다");
    }

    log(`✅ ${sentencesData.length}개의 문장 수신 완료`);

    // 5. MongoDB에 저장
    await Sentence.create({
      sentence: sentencesData,
    });
    log("✅ 데이터베이스 저장 완료");

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`🎉 스크립트 성공적으로 완료 (소요시간: ${elapsed}s)`);
    process.exit(0);
  } catch (error) {
    logError("스크립트 실행 중 오류 발생", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    log("🔌 MongoDB 연결 해제");
  }
}

fetchSentences();
