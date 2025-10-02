// Test Gemini API Key và Models
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
    console.log('🔑 Testing API Key:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');
    console.log('\n📋 Attempting to list available models...\n');

    // Danh sách models để test
    const modelsToTest = [
        'gemini-pro',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'models/gemini-pro',
        'models/gemini-1.5-flash'
    ];

    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hello');
            const response = await result.response;
            const text = response.text();
            console.log(`✅ ${modelName} - SUCCESS!`);
            console.log(`   Response: ${text.substring(0, 50)}...\n`);
            break; // Nếu thành công thì dừng
        } catch (error) {
            console.log(`❌ ${modelName} - FAILED`);
            console.log(`   Error: ${error.message}\n`);
        }
    }
}

testModels().catch(console.error);
