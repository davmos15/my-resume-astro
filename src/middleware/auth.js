import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Simple in-memory session store (in production, use Redis or a database)
const sessions = new Map();

export function createSession(userId) {
  const sessionId = crypto.randomUUID();
  const sessionData = {
    userId,
    createdAt: Date.now(),
    lastAccess: Date.now()
  };
  sessions.set(sessionId, sessionData);
  return sessionId;
}

export function getSession(sessionId) {
  const session = sessions.get(sessionId);
  if (session) {
    // Update last access time
    session.lastAccess = Date.now();
    // Check if session is expired (24 hours)
    if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
      sessions.delete(sessionId);
      return null;
    }
    return session;
  }
  return null;
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '24h'
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
}

// Middleware to check if user is authenticated
export function requireAuth(handler) {
  return async (context) => {
    const { request } = context;
    const cookies = parseCookies(request.headers.get('cookie') || '');
    const sessionId = cookies.session;
    
    if (!sessionId || !getSession(sessionId)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    return handler(context);
  };
}

function parseCookies(cookieString) {
  const cookies = {};
  cookieString.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  return cookies;
}