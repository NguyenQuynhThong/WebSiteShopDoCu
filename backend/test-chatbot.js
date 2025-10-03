// =============================================
// TEST CHATBOT - Test Gemini 2.0 API
// =============================================

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testChatbot() {
    try {
        console.log('🤖 Testing Gemini 2.0 Flash...\n');
        console.log('API Key:', process.env.GEMINI_API_KEY ? '✓ Found' : '✗ Missing');
        console.log('');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Test với Gemini 2.0 Flash
        console.log('📡 Connecting to Gemini 2.0 Flash...');
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                temperature: 0.9,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 1024,
            }
        });

        console.log('✓ Model initialized');
        console.log('');

        // Test message
        const testMessage = "Xin chào! Shop bán những loại sản phẩm gì?";
        console.log('💬 Test message:', testMessage);
        console.log('⏳ Waiting for response...\n');

        const result = await model.generateContent(testMessage);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Response received:');
        console.log('─'.repeat(60));
        console.log(text);
        console.log('─'.repeat(60));
        console.log('');
        console.log('🎉 Chatbot test successful!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('');
        console.error('Details:', error);
        
        // Test fallback model
        console.log('\n🔄 Trying fallback model (Gemini 1.5 Flash)...');
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ 
                model: 'gemini-1.5-flash',
                generationConfig: {
                    temperature: 0.9,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 1024,
                }
            });

            const result = await model.generateContent("Hello! This is a test.");
            const response = await result.response;
            const text = response.text();

            console.log('✅ Fallback model works!');
            console.log('Response:', text.substring(0, 100) + '...');
        } catch (fallbackError) {
            console.error('❌ Fallback also failed:', fallbackError.message);
        }
    } finally {
        process.exit(0);
    }
}

testChatbot();
