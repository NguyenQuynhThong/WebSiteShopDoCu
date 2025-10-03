// Test với system prompt
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const SYSTEM_PROMPT = `Bạn là trợ lý ảo thân thiện của LAG Vintage Shop - cửa hàng chuyên bán đồ thời trang vintage và công nghệ cũ chất lượng cao.

THÔNG TIN VỀ SHOP:
- Tên shop: LAG Vintage Shop  
- Chuyên: Thời trang vintage (áo khoác, áo sơ mi, quần, váy) và công nghệ cũ (điện thoại, laptop, tai nghe)
- Đặc điểm: Sản phẩm second-hand chất lượng cao
- Website: Hỗ trợ đặt hàng online

NHIỆM VỤ: Tư vấn sản phẩm, hỗ trợ khách hàng một cách thân thiện, ngắn gọn (2-3 câu).`;

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            maxOutputTokens: 512,
        }
    });

    const message = "Shop có áo khoác vintage không?";
    const fullPrompt = `${SYSTEM_PROMPT}\n\nKHÁCH HÀNG: ${message}\nTRỢ LÝ:`;

    console.log('Sending:', message);
    console.log('');
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    console.log('Bot reply:');
    console.log(text);
    process.exit(0);
}

test();
