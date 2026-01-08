import mongoose from "mongoose";
import dotenv from "dotenv";
import OpenAI from "openai";
import { Sentence } from "../src/models/sentence.model";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fetchSentences(): Promise<void> {
  try {
    // 1. Connect to MongoDB
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB 연결됨");

    // 2. Call OpenAI API
    const prompt = `
      Please generate 10 unique English sentences with their Korean translations.
      For each sentence, also select 2 key words and provide their translations.
      Return the result strictly as a JSON object with a "definitions" key containing the array.
      
      The format should be exactly like this example:
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

    console.log("OpenAI 데이터 요청 중...");
    const completion = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message?.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    const parsedData = JSON.parse(content);
    const sentencesData = parsedData.definitions;

    console.log(`${sentencesData.length}개의 문장을 수신함`);

    // 3. Save to MongoDB
    // model 스키마에 맞춰서 { sentence: [...] } 형태로 저장
    await Sentence.create({
      sentence: sentencesData,
    });
    console.log("데이터베이스에 저장 완료!");
  } catch (error) {
    console.error("fetchSentences 오류:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB 연결 해제됨");
  }
}

fetchSentences();
