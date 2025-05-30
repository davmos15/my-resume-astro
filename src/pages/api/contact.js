import db from '../../lib/db.js';

export const POST = async ({ request }) => {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, header, description } = body;
    
    // Validate required fields
    if (!name || !email || !description) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Name, email, and message are required fields'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Please provide a valid email address'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Store message in database
    const stmt = db.prepare(`
      INSERT INTO contact_messages 
      (name, email, subject, message, created_at, is_read) 
      VALUES (?, ?, ?, ?, datetime('now'), 0)
    `);
    
    const result = stmt.run(
      name.trim(),
      email.trim(),
      header?.trim() || 'No subject',
      description.trim()
    );
    
    // Log the submission
    console.log('New contact form submission:', {
      id: result.lastInsertRowid,
      from: name,
      email: email,
      subject: header || 'No subject',
      timestamp: new Date().toISOString()
    });
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Thank you for your message. Nadav will be in contact soon.'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Sorry, there was an error processing your message. Please try again later.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Optionally, add a GET endpoint to check if the API is working
export const GET = async () => {
  return new Response(JSON.stringify({
    message: 'Contact API endpoint is working'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};