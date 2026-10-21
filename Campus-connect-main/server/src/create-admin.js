import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pool from './db.js';

const [name, email, username, password] = process.argv.slice(2);
if (!name || !email || !username || !password) {
  console.error('Usage: npm run create-admin -- "Admin Name" admin@example.edu adminuser "StrongPasswordHere"');
  process.exit(1);
}
if (password.length < 12) {
  console.error('Admin password must be at least 12 characters.');
  process.exit(1);
}
try {
  const hash = await bcrypt.hash(password, 12);
  await pool.execute('INSERT INTO users(full_name,email,username,password_hash,role) VALUES(?,?,?,?,?)', [name, email, username, hash, 'admin']);
  console.log(`Administrator ${username} created.`);
} catch (error) {
  console.error(error.code === 'ER_DUP_ENTRY' ? 'Email or username already exists.' : error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
