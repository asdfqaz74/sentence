import { fetchLatestSentence } from "../service/sentence.service";
import connectDB from "../config/db";

(async () => {
  try {
    console.log("⏰ 패치를 시작합니다...");

    await connectDB();

    const { dayFormatted, ...sentenceData } = await fetchLatestSentence();

    console.log(`✅ ${dayFormatted} 문장 5개를 불러왔습니다.`, {
      count: sentenceData.sentence?.length,
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ 패치에 실패했습니다.", error);
    process.exit(1);
  }
})();
