// ============================================
// CHECK ADMIN ACCOUNTS
// ============================================

const { pool: db } = require('./config/database');

async function checkAdminAccounts() {
    try {
        console.log('\n🔍 Checking admin accounts in database...\n');
        
        const [admins] = await db.query(
            "SELECT user_id, email, full_name, role, status, created_at, last_login FROM users WHERE role = 'admin'"
        );
        
        if (admins.length === 0) {
            console.log('⚠️  No admin accounts found!');
            console.log('💡 Run: node create-admin.js to create an admin account\n');
        } else {
            console.log(`✅ Found ${admins.length} admin account(s):\n`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            admins.forEach((admin, index) => {
                console.log(`\n📋 Admin #${index + 1}:`);
                console.log(`   🆔 User ID: ${admin.user_id}`);
                console.log(`   📧 Email: ${admin.email}`);
                console.log(`   👤 Full Name: ${admin.full_name}`);
                console.log(`   🎭 Role: ${admin.role}`);
                console.log(`   ✅ Status: ${admin.status}`);
                console.log(`   📅 Created: ${admin.created_at}`);
                console.log(`   🕐 Last Login: ${admin.last_login || 'Never'}`);
            });
            
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('\n💡 Login Instructions:');
            console.log('   1. Go to: http://localhost:5500/frontend/login.html');
            console.log('   2. Use the email from above');
            console.log('   3. Default password: admin123 (if not changed)');
            console.log('   4. You will be redirected to admin.html after login\n');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run the script
checkAdminAccounts();
