import { requireAuth } from '../../../middleware/auth.js';
import db from '../../../lib/db.js';

// GET - List all projects
export const GET = requireAuth(async ({ request }) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    
    return new Response(JSON.stringify({
      success: true,
      projects
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to fetch projects'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// POST - Create new project
export const POST = requireAuth(async ({ request }) => {
  try {
    const data = await request.json();
    const { title, description, technologies, github_link, demo_link, image_url, emoji, subtitle } = data;
    
    // Validate required fields
    if (!title || !description || !technologies) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Title, description, and technologies are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const stmt = db.prepare(`
      INSERT INTO projects (title, description, technologies, github_link, live_link, image_url, emoji, subtitle, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
    `);
    
    const result = stmt.run(title, description, technologies, github_link, demo_link, image_url, emoji, subtitle);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Project created successfully',
      projectId: result.lastInsertRowid
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error creating project:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to create project'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// PUT - Update project
export const PUT = requireAuth(async ({ request }) => {
  try {
    const data = await request.json();
    const { id, title, description, technologies, github_link, demo_link, image_url, emoji, subtitle, is_active } = data;
    
    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Project ID is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const stmt = db.prepare(`
      UPDATE projects 
      SET title = ?, description = ?, technologies = ?, github_link = ?, live_link = ?, 
          image_url = ?, emoji = ?, subtitle = ?, is_active = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    
    const result = stmt.run(title, description, technologies, github_link, demo_link, image_url, emoji, subtitle, is_active ? 1 : 0, id);
    
    if (result.changes === 0) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Project not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Project updated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error updating project:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to update project'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// DELETE - Delete project
export const DELETE = requireAuth(async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Project ID is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Project not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Project deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error deleting project:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to delete project'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});