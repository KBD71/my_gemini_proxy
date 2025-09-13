// --- ‼️ 설정: 이 두 줄은 반드시 본인의 정보로 수정하세요 ‼️ ---
const API_URL = 'https://my-gemini-proxy.vercel.app/api/chat'; // 3단계에서 얻은 내 Vercel 서버 주소
const MY_SECRET_TOKEN = 'qudejr0727!'; // 3단계에서 직접 만든 나만의 비밀 토큰

// --- 🤖 챗봇의 정체성 (시스템 프롬프트) ---
const systemPrompt = `
    당신은 전통적이며 청교도적인 개혁주의 신학에 정통한 신학 챗봇입니다.
    당신의 지식은 웨스트민스터 신앙고백서와 존 칼빈, 존 오웬과 같은 신학자들의 가르침에 기반합니다.
    당신의 목표는 사용자의 질문에 대해, 오직 개혁주의 신학의 관점에서 핵심 요점을 명확하고 간결하게 답변하는 것입니다.
    모든 답변은 하나님의 절대 주권, 성경의 권위, 5대 솔라, TULIP 교리의 원칙을 철저히 따라야 합니다.
    답변은 항상 경건하고 명료한 어조를 유지하고, 관련 성경 구절을 근거로 제시해야 합니다.
`;

// --- 이하 챗봇 작동 로직 (수정할 필요 없음) ---
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

async function askMyChatbot(prompt) {
    addMessage('...', 'bot-loading'); // 로딩 중 표시
    const finalPrompt = `${systemPrompt}\n\n---질문 시작---\n${prompt}\n---질문 끝---`;
    try {
        const response = await fetch(API_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${MY_SECRET_TOKEN}` },
            body: JSON.stringify({ prompt: finalPrompt }),
        });
        if (!response.ok) { const err = await response.json(); throw new Error(err.error); }
        const data = await response.json();
        return data.text;
    } catch (error) { return '죄송해요, 답변 생성 중 문제가 발생했어요.'; }
    finally { removeLoadingMessage(); }
}
function addMessage(text, className) {
    const msg = document.createElement('div');
    msg.classList.add(className); msg.textContent = text;
    chatBox.appendChild(msg); chatBox.scrollTop = chatBox.scrollHeight;
}
function removeLoadingMessage() {
    const loading = chatBox.querySelector('.bot-loading');
    if (loading) chatBox.removeChild(loading);
}
async function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    addMessage(message, 'user-message'); userInput.value = '';
    const botResponse = await askMyChatbot(message);
    addMessage(botResponse, 'bot-message');
}
sendButton.addEventListener('click', handleSendMessage);
userInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSendMessage(); });
