import { verifyPassword, createSession } from '../../../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

export async function POST({ request }) {
  try {
    const { username, password } = await request.json();
    
    // Validate input
    if (!username || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Username and password are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check credentials
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    
    if (username !== adminUsername || !verifyPassword(password, adminPasswordHash)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Invalid username or password' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create session
    const sessionId = createSession(username);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Login successful' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `session=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}