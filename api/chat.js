// Google AI SDK를 가져옵니다.
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 서버리스 함수 핸들러
export default async function handler(request, response) {
  // CORS 헤더 설정: 모든 출처에서의 요청을 허용합니다.
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 브라우저가 본 요청을 보내기 전에 보내는 OPTIONS 요청 (preflight) 처리
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // POST 요청이 아닐 경우 에러 처리
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'POST 요청만 허용됩니다.' });
  }

  try {
    // 1. 환경 변수에서 Gemini API 키를 안전하게 불러옵니다.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 2. 클라이언트(챗봇 UI)가 보낸 메시지를 가져옵니다.
    const { prompt } = request.body;
    if (!prompt) {
      return response.status(400).json({ error: '프롬프트가 없습니다.' });
    }

    // 3. Gemini 모델을 선택하고 API를 호출합니다.
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;
    const text = geminiResponse.text();

    // 4. Gemini의 답변을 클라이언트로 다시 보내줍니다.
    response.status(200).json({ text });

  } catch (error) {
    console.error('API 호출 중 에러 발생:', error);
    response.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  }
}