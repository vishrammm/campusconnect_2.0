import jwt from 'jsonwebtoken';

export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'replace_this_secret_before_deploying', { expiresIn: '12h' });
}
export function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try { req.auth = jwt.verify(token, process.env.JWT_SECRET || 'replace_this_secret_before_deploying'); next(); }
  catch { return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' }); }
}
export function allowRoles(...roles) {
  return (req, res, next) => roles.includes(req.auth?.role) ? next() : res.status(403).json({ error: 'You do not have permission to perform this action.' });
}
