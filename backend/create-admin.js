// ============================================
// CREATE ADMIN ACCOUNT
// ============================================

const { pool: db } = require('./config/database');
const bcrypt = require('bcrypt');

async function createAdminAccount() {
    try {
        console.log('🔍 Checking for existing admin account...');
        
        // Check if admin exists
        const [admins] = await db.query(
            "SELECT user_id, email, role FROM users WHERE role = 'admin'"
        );
        
        if (admins.length > 0) {
            console.log('✅ Admin account already exists:');
            admins.forEach(admin => {
                console.log(`   📧 Email: ${admin.email}`);
                console.log(`   🆔 User ID: ${admin.user_id}`);
                console.log(`   👤 Role: ${admin.role}`);
            });
            
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            readline.question('\n❓ Do you want to create another admin account? (y/n): ', async (answer) => {
                if (answer.toLowerCase() === 'y') {
                    readline.close();
                    await createNewAdmin();
                } else {
                    console.log('\n✅ No new admin created.');
                    readline.close();
                    process.exit(0);
                }
            });
        } else {
            console.log('⚠️  No admin account found. Creating default admin...');
            await createNewAdmin();
        }
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

async function createNewAdmin() {
    try {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        console.log('\n📝 Creating new admin account...\n');
        
        // Get email
        readline.question('📧 Enter admin email (default: admin@lagvintage.com): ', async (email) => {
            email = email.trim() || 'admin@lagvintage.com';
            
            // Check if email exists
            const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
            if (existing.length > 0) {
                console.log('❌ Email already exists. Please use another email.');
                readline.close();
                process.exit(1);
                return;
            }
            
            // Get password
            readline.question('🔒 Enter admin password (default: admin123): ', async (password) => {
                password = password.trim() || 'admin123';
                
                // Get full name
                readline.question('👤 Enter admin full name (default: Administrator): ', async (fullName) => {
                    fullName = fullName.trim() || 'Administrator';
                    
                    // Hash password
                    const hashedPassword = await bcrypt.hash(password, 10);
                    
                    // Insert admin user
                    const [result] = await db.query(
                        "INSERT INTO users (email, password, full_name, role, status) VALUES (?, ?, ?, 'admin', 'active')",
                        [email, hashedPassword, fullName]
                    );
                    
                    console.log('\n✅ Admin account created successfully!');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('📧 Email:', email);
                    console.log('🔒 Password:', password);
                    console.log('🆔 User ID:', result.insertId);
                    console.log('👤 Full Name:', fullName);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('\n⚠️  Please save these credentials!');
                    console.log('🌐 Login at: http://localhost:5500/frontend/login.html\n');
                    
                    readline.close();
                    process.exit(0);
                });
            });
        });
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
}

// Run the script
createAdminAccount();
