// =============================================
// TEST QR CODE GENERATION
// =============================================

const Payment = require('./models/Payment');

// Test với các số tiền khác nhau
const testCases = [
    { orderCode: 'ORDER-001', amount: 150000, desc: 'Test 150k' },
    { orderCode: 'ORDER-002', amount: 1500000, desc: 'Test 1.5M' },
    { orderCode: 'ORDER-003', amount: 500000.50, desc: 'Test 500k.50' },
    { orderCode: 'ORDER-004', amount: '250000', desc: 'Test string 250k' }
];

console.log('='.repeat(60));
console.log('TEST QR CODE GENERATION - VIETQR');
console.log('='.repeat(60));

testCases.forEach((test, index) => {
    console.log(`\nTest ${index + 1}: ${test.desc}`);
    console.log('Input amount:', test.amount, typeof test.amount);
    
    const qr = Payment.generateQRCode(test.orderCode, test.amount, test.desc);
    
    console.log('Output amount:', qr.amount, typeof qr.amount);
    console.log('QR URL:', qr.qrUrl);
    console.log('Bank:', qr.bank_code, '-', qr.account_number);
    console.log('Account Name:', qr.account_name);
    console.log('Content:', qr.content);
});

console.log('\n' + '='.repeat(60));
console.log('BANK INFO:');
console.log('='.repeat(60));
console.log('Bank:', Payment.BANK_INFO.bankCode);
console.log('Account:', Payment.BANK_INFO.accountNumber);
console.log('Name:', Payment.BANK_INFO.accountName);
console.log('='.repeat(60));
