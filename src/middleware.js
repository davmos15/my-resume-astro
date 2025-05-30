import { getSession } from './middleware/auth.js';

export async function onRequest({ request, redirect }, next) {
  const url = new URL(request.url);
  
  // Check if this is an admin route
  if (url.pathname.startsWith('/admin/') && url.pathname !== '/admin/login') {
    const cookies = parseCookies(request.headers.get('cookie') || '');
    const sessionId = cookies.session;
    
    if (!sessionId || !getSession(sessionId)) {
      return redirect('/admin/login');
    }
  }
  
  return next();
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