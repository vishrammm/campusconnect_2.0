import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import pool from './db.js';
import { authenticate, allowRoles, signToken } from './auth.js';

const app = express();
const port = Number(process.env.PORT || 3000);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: (process.env.CORS_ORIGIN || '').split(',').filter(Boolean).length ? (process.env.CORS_ORIGIN || '').split(',') : true }));
app.use(express.json({ limit: '1mb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 40, standardHeaders: true, legacyHeaders: false }));
const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const roles = ['student', 'co-admin', 'staff', 'admin'];
const publicUser = u => ({ id: u.id, name: u.full_name, email: u.email, mobile: u.phone, role: u.role, year: u.year, branch: u.branch, club: u.club, title: u.title });
const clean = v => typeof v === 'string' ? v.trim() : v;

app.get('/api/health', asyncRoute(async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok', service: 'campus-connect-api', database: 'connected' });
}));

app.post('/api/auth/register', asyncRoute(async (req, res) => {
  const { name, email, username, password, role = 'student', mobile, year, branch, club, title } = req.body || {};
  if (!clean(name) || !clean(username) || !password) return res.status(400).json({ error: 'Name, username and password are required.' });
  if (String(password).length < 8) return res.status(400).json({ error: 'Password must contain at least 8 characters.' });
  if (!roles.filter(r => r !== 'admin').includes(role)) return res.status(400).json({ error: 'Invalid registration role.' });
  if (role === 'staff' && !clean(mobile)) return res.status(400).json({ error: 'Staff registration requires a mobile number.' });
  if (role !== 'staff' && !clean(email)) return res.status(400).json({ error: 'Email is required.' });
  const password_hash = await bcrypt.hash(password, 12);
  try {
    const [result] = await pool.execute(
      `INSERT INTO users (full_name,email,username,password_hash,phone,role,year,branch,club,title)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [clean(name), clean(email) || null, clean(username), password_hash, clean(mobile) || null, role, clean(year) || null, clean(branch) || null, clean(club) || null, clean(title) || null]
    );
    const [rows] = await pool.execute('SELECT * FROM users WHERE id=?', [result.insertId]);
    res.status(201).json({ message: 'Account created. You can now sign in.', user: publicUser(rows[0]) });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'That email, username or phone number is already registered.' });
    throw e;
  }
}));

app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const { identifier, password, role } = req.body || {};
  if (!clean(identifier) || !password || !roles.includes(role)) return res.status(400).json({ error: 'Identifier, password and a valid role are required.' });
  const field = role === 'staff' ? 'phone' : 'email';
  const [rows] = await pool.execute(`SELECT * FROM users WHERE ${field}=? OR username=? LIMIT 1`, [clean(identifier), clean(identifier)]);
  const user = rows[0];
  if (!user || user.role !== role || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ error: 'Invalid credentials for the selected role.' });
  await pool.execute('UPDATE users SET last_login=UTC_TIMESTAMP() WHERE id=?', [user.id]);
  res.json({ token: signToken({ id: user.id, role: user.role }), user: publicUser(user) });
}));
app.get('/api/auth/me', authenticate, asyncRoute(async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id=?', [req.auth.id]);
  if (!rows[0]) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: publicUser(rows[0]) });
}));
app.patch('/api/profile', authenticate, asyncRoute(async (req, res) => {
  const { name, mobile, year, branch, club, title } = req.body || {};
  await pool.execute('UPDATE users SET full_name=COALESCE(?,full_name), phone=COALESCE(?,phone), year=COALESCE(?,year), branch=COALESCE(?,branch), club=COALESCE(?,club), title=COALESCE(?,title) WHERE id=?', [clean(name) || null, clean(mobile) || null, clean(year) || null, clean(branch) || null, clean(club) || null, clean(title) || null, req.auth.id]);
  const [rows] = await pool.execute('SELECT * FROM users WHERE id=?', [req.auth.id]);
  res.json({ user: publicUser(rows[0]) });
}));

// Lost & Found
app.get('/api/items', asyncRoute(async (req, res) => {
  const q = `%${clean(req.query.q || '')}%`, status = clean(req.query.status || '');
  const [rows] = await pool.execute(`SELECT i.*,u.full_name AS reporter FROM lost_found_items i LEFT JOIN users u ON u.id=i.reported_by WHERE (i.title LIKE ? OR i.description LIKE ? OR i.location LIKE ?) AND (?='' OR i.status=?) ORDER BY i.created_at DESC LIMIT 200`, [q,q,q,status,status]);
  res.json({ items: rows });
}));
app.post('/api/items', authenticate, asyncRoute(async (req, res) => {
  const { title, description, category, status = 'lost', location, event_date } = req.body || {};
  if (!clean(title) || !clean(category) || !clean(location)) return res.status(400).json({ error: 'Title, category and location are required.' });
  if (!['lost','found'].includes(status)) return res.status(400).json({ error: 'Status must be lost or found.' });
  const [result] = await pool.execute('INSERT INTO lost_found_items (title,description,category,status,location,event_date,reported_by) VALUES (?,?,?,?,?,?,?)', [clean(title),clean(description)||null,clean(category),status,clean(location),clean(event_date)||null,req.auth.id]);
  res.status(201).json({ itemId: result.insertId, message: 'Item report created.' });
}));
app.patch('/api/items/:id/status', authenticate, allowRoles('staff','admin'), asyncRoute(async (req,res) => {
  if (!['lost','found','claimed','security_desk'].includes(req.body.status)) return res.status(400).json({error:'Invalid item status.'});
  const [r] = await pool.execute('UPDATE lost_found_items SET status=? WHERE id=?',[req.body.status,req.params.id]);
  if (!r.affectedRows) return res.status(404).json({error:'Item not found.'}); res.json({message:'Item status updated.'});
}));

// Notices
app.get('/api/notices', asyncRoute(async (_req,res) => { const [rows]=await pool.query('SELECT n.*,u.full_name AS author FROM notices n LEFT JOIN users u ON u.id=n.posted_by WHERE n.is_published=1 ORDER BY n.created_at DESC LIMIT 200'); res.json({notices:rows}); }));
app.post('/api/notices', authenticate, allowRoles('co-admin','admin','staff'), asyncRoute(async(req,res)=>{
  const {title,content,category='General',priority='normal'}=req.body||{};
  if(!clean(title)||!clean(content)) return res.status(400).json({error:'Title and content are required.'});
  const [r]=await pool.execute('INSERT INTO notices(title,content,category,priority,posted_by) VALUES(?,?,?,?,?)',[clean(title),clean(content),clean(category),priority==='important'?'important':'normal',req.auth.id]);
  res.status(201).json({noticeId:r.insertId,message:'Notice published.'});
}));
app.delete('/api/notices/:id', authenticate, allowRoles('admin','co-admin'), asyncRoute(async(req,res)=>{const [r]=await pool.execute('UPDATE notices SET is_published=0 WHERE id=?',[req.params.id]); if(!r.affectedRows)return res.status(404).json({error:'Notice not found.'});res.json({message:'Notice removed.'});}));

// Clubs, events, and registration
app.get('/api/clubs', asyncRoute(async(_req,res)=>{const [rows]=await pool.query('SELECT * FROM clubs WHERE is_active=1 ORDER BY name');res.json({clubs:rows});}));
app.get('/api/events', asyncRoute(async(_req,res)=>{const [rows]=await pool.query('SELECT e.*,c.name AS club_name,u.full_name AS creator,(SELECT COUNT(*) FROM event_registrations r WHERE r.event_id=e.id) AS registrations FROM events e LEFT JOIN clubs c ON c.id=e.club_id LEFT JOIN users u ON u.id=e.created_by WHERE e.is_published=1 ORDER BY e.event_date ASC LIMIT 200');res.json({events:rows});}));
app.post('/api/events', authenticate, allowRoles('co-admin','admin'), asyncRoute(async(req,res)=>{const {name,description,date,time,venue,clubId}=req.body||{};if(!clean(name)||!clean(date)||!clean(venue))return res.status(400).json({error:'Event name, date and venue are required.'});const [r]=await pool.execute('INSERT INTO events(club_id,name,description,event_date,event_time,venue,created_by) VALUES(?,?,?,?,?,?,?)',[clubId||null,clean(name),clean(description)||null,clean(date),clean(time)||null,clean(venue),req.auth.id]);res.status(201).json({eventId:r.insertId,message:'Event created.'});}));
app.post('/api/events/:id/register', authenticate, asyncRoute(async(req,res)=>{try{await pool.execute('INSERT INTO event_registrations(event_id,user_id) VALUES(?,?)',[req.params.id,req.auth.id]);res.status(201).json({message:'Registration successful.'});}catch(e){if(e.code==='ER_DUP_ENTRY')return res.status(409).json({error:'You are already registered for this event.'});if(e.code==='ER_NO_REFERENCED_ROW_2')return res.status(404).json({error:'Event not found.'});throw e;}}));
app.delete('/api/events/:id/register', authenticate, asyncRoute(async(req,res)=>{await pool.execute('DELETE FROM event_registrations WHERE event_id=? AND user_id=?',[req.params.id,req.auth.id]);res.json({message:'Registration cancelled.'});}));

// Marketplace
app.get('/api/marketplace', asyncRoute(async(req,res)=>{const q=`%${clean(req.query.q||'')}%`;const [rows]=await pool.execute('SELECT p.*,u.full_name AS seller_name,u.phone AS seller_phone FROM marketplace_listings p LEFT JOIN users u ON u.id=p.seller_id WHERE p.is_active=1 AND (p.title LIKE ? OR p.description LIKE ? OR p.category LIKE ?) ORDER BY p.created_at DESC LIMIT 200',[q,q,q]);res.json({listings:rows});}));
app.post('/api/marketplace', authenticate, asyncRoute(async(req,res)=>{const {title,description,category,price,condition,location}=req.body||{};if(!clean(title)||!category||!Number.isFinite(Number(price))||Number(price)<0)return res.status(400).json({error:'Title, category and a valid price are required.'});const [r]=await pool.execute('INSERT INTO marketplace_listings(title,description,category,price,condition_label,location,seller_id) VALUES(?,?,?,?,?,?,?)',[clean(title),clean(description)||null,clean(category),Number(price),clean(condition)||'Used',clean(location)||null,req.auth.id]);res.status(201).json({listingId:r.insertId,message:'Listing published.'});}));
app.delete('/api/marketplace/:id', authenticate, asyncRoute(async(req,res)=>{const [r]=await pool.execute('UPDATE marketplace_listings SET is_active=0 WHERE id=? AND (seller_id=? OR ?="admin")',[req.params.id,req.auth.id,req.auth.role]);if(!r.affectedRows)return res.status(404).json({error:'Listing not found or not owned by you.'});res.json({message:'Listing removed.'});}));

app.get('/api/notifications', authenticate, asyncRoute(async(req,res)=>{const [rows]=await pool.execute('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 100',[req.auth.id]);res.json({notifications:rows});}));
app.patch('/api/notifications/:id/read', authenticate, asyncRoute(async(req,res)=>{await pool.execute('UPDATE notifications SET is_read=1 WHERE id=? AND user_id=?',[req.params.id,req.auth.id]);res.json({message:'Notification marked read.'});}));
app.get('/api/admin/stats', authenticate, allowRoles('admin'), asyncRoute(async(_req,res)=>{const [[users]]=await pool.query('SELECT COUNT(*) AS total FROM users');const [[items]]=await pool.query('SELECT COUNT(*) AS total FROM lost_found_items');const [[events]]=await pool.query('SELECT COUNT(*) AS total FROM events');const [[listings]]=await pool.query('SELECT COUNT(*) AS total FROM marketplace_listings WHERE is_active=1');res.json({users:users.total,items:items.total,events:events.total,listings:listings.total});}));

app.use((req,res)=>res.status(404).json({error:`Route not found: ${req.method} ${req.path}`}));
app.use((err,_req,res,_next)=>{console.error(err);res.status(500).json({error:process.env.NODE_ENV==='production'?'An unexpected server error occurred.':err.message});});
app.listen(port,'0.0.0.0',()=>console.log(`Campus Connect API listening on ${port}`));
