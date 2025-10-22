
// utils/generate-hash.js
const bcrypt = require('bcrypt');

/**
 * This script generates a bcrypt hash for a given password.
 * 
 * Usage:
 * node generate-hash.js [your_password_here]
 * 
 * Example:
 * node generate-hash.js 123456
 */

// The password is taken from the command-line arguments.
const password = process.argv[2];

if (!password) {
  console.error('❌ Please provide a password as an argument.');
  console.error('Usage: node generate-hash.js [your_password_here]');
  process.exit(1);
}

// The number of salt rounds. 10 is a good default.
const saltRounds = 10;

// Generate the hash
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  
  console.log('✅ Password to hash:', password);
  console.log('🔑 Bcrypt Hash:', hash);
  console.log('\nCopy this hash into your database password column.');
});
