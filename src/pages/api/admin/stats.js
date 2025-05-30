import db from '../../../lib/db.js';

export async function GET(context) {
  // Check authentication
  const session = context.cookies.get('session');
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Get counts from database using better-sqlite3 syntax
    const projectsResult = db.prepare('SELECT COUNT(*) as count FROM projects WHERE is_active = 1').get();
    const pagesResult = db.prepare('SELECT COUNT(DISTINCT page_name) as count FROM page_content').get();
    
    // Handle case where files table might not exist
    let filesResult;
    try {
      filesResult = db.prepare('SELECT COUNT(*) as count FROM files').get();
    } catch {
      filesResult = { count: 0 };
    }
    
    // Handle case where resume_entries table might not exist, try resume_sections
    let resumeResult;
    try {
      resumeResult = db.prepare('SELECT COUNT(*) as count FROM resume_sections WHERE is_active = 1').get();
    } catch {
      try {
        resumeResult = db.prepare('SELECT COUNT(*) as count FROM resume_entries').get();
      } catch {
        resumeResult = { count: 0 };
      }
    }

    const stats = {
      projects: { count: projectsResult?.count || 0 },
      pages: { count: pagesResult?.count || 0 },
      files: { count: filesResult?.count || 0 },
      resume: { count: resumeResult?.count || 0 }
    };

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch stats',
      projects: { count: 0 },
      pages: { count: 0 },
      files: { count: 0 },
      resume: { count: 0 }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}