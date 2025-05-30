import { deleteSession } from '../../../middleware/auth.js';

export async function POST({ request }) {
  const cookies = parseCookies(request.headers.get('cookie') || '');
  const sessionId = cookies.session;
  
  if (sessionId) {
    deleteSession(sessionId);
  }
  
  return new Response(JSON.stringify({ 
    success: true, 
    message: 'Logged out successfully' 
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
    }
  });
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