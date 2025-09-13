const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(request, response) {
  // CORS 헤더 설정 (어떤 웹사이트든 이 서버를 호출할 수 있게 허용)
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // 1. '신분증' 검사: 우리 웹사이트가 보낸 요청이 맞는지 확인
  const clientToken = request.headers['authorization'];
  const serverToken = `Bearer ${process.env.MY_SECRET_TOKEN}`;
  if (clientToken !== serverToken) {
    return response.status(401).json({ error: '인증되지 않은 요청입니다.' });
  }

  try {
    // 2. '금고 열쇠' 사용: Vercel에 안전하게 저장된 Gemini API 키 불러오기
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const { prompt } = request.body;
    
    // 3. Gemini에게 질문하고 답변 받기
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;
    const text = geminiResponse.text();

    // 4. 결과를 다시 웹사이트로 보내주기
    response.status(200).json({ text });
  } catch (error) {
    response.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  }
}
