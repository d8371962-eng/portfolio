import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Database Setup
let db;

const initDB = async () => {
  try {
    db = await open({
      filename: path.join(process.cwd(), 'portfolio.db'),
      driver: sqlite3.Database
    });

    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT NOT NULL,
        text TEXT NOT NULL,
        userId TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        longDescription TEXT,
        problem TEXT,
        solution TEXT,
        tech TEXT,
        image TEXT,
        contributions TEXT,
        liveUrl TEXT,
        githubUrl TEXT,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        difficulty TEXT
      );
      
      CREATE TABLE IF NOT EXISTS education (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        degree TEXT NOT NULL,
        institution TEXT NOT NULL,
        year TEXT,
        description TEXT
      );
      
      CREATE TABLE IF NOT EXISTS experience (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        duration TEXT,
        description TEXT
      );
      
      CREATE TABLE IF NOT EXISTS userdata (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT
      );
      
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clientName TEXT NOT NULL,
        clientRole TEXT,
        clientCompany TEXT,
        clientImage TEXT,
        feedbackText TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        projectTitle TEXT,
        isApproved INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS about_profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profilePicture TEXT,
        summary TEXT,
        phone TEXT,
        email TEXT,
        location TEXT,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        level INTEGER DEFAULT 50
      );
      
      CREATE TABLE IF NOT EXISTS languages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS refs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        title TEXT,
        institution TEXT,
        phone TEXT
      );
    `);

    console.log('✅ SQLite Database Connected');
  } catch (err) {
    console.log('❌ SQLite connection error:', err.message);
  }
};

initDB();

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Helper function to check if SQLite is connected
const isDBConnected = () => db !== undefined;

// API Routes

app.post('/api/messages', async (req, res) => {
  try {
    const { sender, text, userId } = req.body;
    if (!sender || !text) {
      return res.status(400).json({ error: 'Sender and text are required' });
    }

    if (isDBConnected()) {
      const result = await db.run(
        'INSERT INTO messages (sender, text, userId, timestamp) VALUES (?, ?, ?, ?)',
        [sender, text, userId, new Date().toISOString()]
      );
      const message = await db.get('SELECT * FROM messages WHERE id = ?', [result.lastID]);
      res.status(201).json({ success: true, message: 'Message stored successfully', data: message });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to store message' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    if (isDBConnected()) {
      const data = await db.all('SELECT * FROM messages ORDER BY timestamp DESC');
      res.json({ success: true, data });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    if (isDBConnected()) {
      await db.run('DELETE FROM messages WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Message deleted' });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    res.json({ success: true, token: 'admin-token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    if (isDBConnected()) {
      const data = await db.all('SELECT * FROM projects');
      res.json({ success: true, data });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { title, category, description, longDescription, problem, solution, tech, image, contributions, liveUrl, githubUrl } = req.body;
      const result = await db.run(
        'INSERT INTO projects (title, category, description, longDescription, problem, solution, tech, image, contributions, liveUrl, githubUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, category, description, longDescription, problem, solution, JSON.stringify(tech), image, JSON.stringify(contributions), liveUrl, githubUrl]
      );
      const project = await db.get('SELECT * FROM projects WHERE id = ?', [result.lastID]);
      res.status(201).json({ success: true, data: project });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { title, category, description, longDescription, problem, solution, tech, image, contributions, liveUrl, githubUrl } = req.body;
      await db.run(
        'UPDATE projects SET title = ?, category = ?, description = ?, longDescription = ?, problem = ?, solution = ?, tech = ?, image = ?, contributions = ?, liveUrl = ?, githubUrl = ? WHERE id = ?',
        [title, category, description, longDescription, problem, solution, JSON.stringify(tech), image, JSON.stringify(contributions), liveUrl, githubUrl, req.params.id]
      );
      const project = await db.get('SELECT * FROM projects WHERE id = ?', [req.params.id]);
      res.json({ success: true, data: project });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    if (isDBConnected()) {
      await db.run('DELETE FROM projects WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Project deleted' });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

app.get('/api/education', async (req, res) => {
  try {
    if (isDBConnected()) {
      const data = await db.all('SELECT * FROM education');
      res.json({ success: true, data });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch education' });
  }
});

app.post('/api/education', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { degree, institution, year, description } = req.body;
      const result = await db.run(
        'INSERT INTO education (degree, institution, year, description) VALUES (?, ?, ?, ?)',
        [degree, institution, year, description]
      );
      const edu = await db.get('SELECT * FROM education WHERE id = ?', [result.lastID]);
      res.status(201).json({ success: true, data: edu });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create education' });
  }
});

app.put('/api/education/:id', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { degree, institution, year, description } = req.body;
      await db.run(
        'UPDATE education SET degree = ?, institution = ?, year = ?, description = ? WHERE id = ?',
        [degree, institution, year, description, req.params.id]
      );
      const edu = await db.get('SELECT * FROM education WHERE id = ?', [req.params.id]);
      res.json({ success: true, data: edu });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update education' });
  }
});

app.delete('/api/education/:id', async (req, res) => {
  try {
    if (isDBConnected()) {
      await db.run('DELETE FROM education WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Education deleted' });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete education' });
  }
});

app.get('/api/experience', async (req, res) => {
  try {
    if (isDBConnected()) {
      const data = await db.all('SELECT * FROM experience');
      res.json({ success: true, data });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

app.post('/api/experience', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { title, company, duration, description } = req.body;
      const result = await db.run(
        'INSERT INTO experience (title, company, duration, description) VALUES (?, ?, ?, ?)',
        [title, company, duration, description]
      );
      const exp = await db.get('SELECT * FROM experience WHERE id = ?', [result.lastID]);
      res.status(201).json({ success: true, data: exp });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

app.put('/api/experience/:id', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { title, company, duration, description } = req.body;
      await db.run(
        'UPDATE experience SET title = ?, company = ?, duration = ?, description = ? WHERE id = ?',
        [title, company, duration, description, req.params.id]
      );
      const exp = await db.get('SELECT * FROM experience WHERE id = ?', [req.params.id]);
      res.json({ success: true, data: exp });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

app.delete('/api/experience/:id', async (req, res) => {
  try {
    if (isDBConnected()) {
      await db.run('DELETE FROM experience WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Experience deleted' });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

app.get('/api/userdata', async (req, res) => {
  try {
    if (isDBConnected()) {
      const data = await db.all('SELECT * FROM userdata');
      res.json({ success: true, data });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

app.post('/api/userdata', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { key, value } = req.body;
      
      // Check if key exists
      const existing = await db.get('SELECT * FROM userdata WHERE key = ?', [key]);
      
      if (existing) {
        await db.run('UPDATE userdata SET value = ? WHERE key = ?', [JSON.stringify(value), key]);
      } else {
        await db.run('INSERT INTO userdata (key, value) VALUES (?, ?)', [key, JSON.stringify(value)]);
      }
      
      const item = await db.get('SELECT * FROM userdata WHERE key = ?', [key]);
      res.json({ success: true, data: { key: item.key, value: JSON.parse(item.value) } });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to save user data' });
  }
});

// About Profile Routes
app.get('/api/about', async (req, res) => {
  try {
    if (isDBConnected()) {
      const data = await db.get('SELECT * FROM about_profile ORDER BY id DESC LIMIT 1');
      res.json({ success: true, data });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch about profile' });
  }
});

app.post('/api/about', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { profilePicture, summary, phone, email, location } = req.body;
      
      // Check if profile exists
      const existing = await db.get('SELECT * FROM about_profile ORDER BY id DESC LIMIT 1');
      
      if (existing) {
        await db.run(
          'UPDATE about_profile SET profilePicture = ?, summary = ?, phone = ?, email = ?, location = ?, updatedAt = ? WHERE id = ?',
          [profilePicture, summary, phone, email, location, new Date().toISOString(), existing.id]
        );
        const updated = await db.get('SELECT * FROM about_profile WHERE id = ?', [existing.id]);
        res.json({ success: true, data: updated });
      } else {
        const result = await db.run(
          'INSERT INTO about_profile (profilePicture, summary, phone, email, location) VALUES (?, ?, ?, ?, ?)',
          [profilePicture, summary, phone, email, location]
        );
        const profile = await db.get('SELECT * FROM about_profile WHERE id = ?', [result.lastID]);
        res.status(201).json({ success: true, data: profile });
      }
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to save about profile' });
  }
});

// Skills Routes
app.get('/api/skills', async (req, res) => {
  try {
    if (isDBConnected()) {
      const data = await db.all('SELECT * FROM skills');
      res.json({ success: true, data });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

app.post('/api/skills', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { name, category, level } = req.body;
      const result = await db.run(
        'INSERT INTO skills (name, category, level) VALUES (?, ?, ?)',
        [name, category, level || 50]
      );
      const skill = await db.get('SELECT * FROM skills WHERE id = ?', [result.lastID]);
      res.status(201).json({ success: true, data: skill });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

app.put('/api/skills/:id', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { name, category, level } = req.body;
      await db.run(
        'UPDATE skills SET name = ?, category = ?, level = ? WHERE id = ?',
        [name, category, level, req.params.id]
      );
      const skill = await db.get('SELECT * FROM skills WHERE id = ?', [req.params.id]);
      res.json({ success: true, data: skill });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

app.delete('/api/skills/:id', async (req, res) => {
  try {
    if (isDBConnected()) {
      await db.run('DELETE FROM skills WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Skill deleted' });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// Languages Routes
app.get('/api/languages', async (req, res) => {
  try {
    if (isDBConnected()) {
      const data = await db.all('SELECT * FROM languages');
      res.json({ success: true, data });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

app.post('/api/languages', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { name } = req.body;
      const result = await db.run('INSERT INTO languages (name) VALUES (?)', [name]);
      const lang = await db.get('SELECT * FROM languages WHERE id = ?', [result.lastID]);
      res.status(201).json({ success: true, data: lang });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create language' });
  }
});

app.delete('/api/languages/:id', async (req, res) => {
  try {
    if (isDBConnected()) {
      await db.run('DELETE FROM languages WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Language deleted' });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete language' });
  }
});

// References Routes
app.get('/api/references', async (req, res) => {
  try {
    if (isDBConnected()) {
      const data = await db.all('SELECT * FROM refs');
      res.json({ success: true, data });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch references' });
  }
});

app.post('/api/references', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { name, title, institution, phone } = req.body;
      const result = await db.run(
        'INSERT INTO refs (name, title, institution, phone) VALUES (?, ?, ?, ?)',
        [name, title, institution, phone]
      );
      const ref = await db.get('SELECT * FROM refs WHERE id = ?', [result.lastID]);
      res.status(201).json({ success: true, data: ref });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reference' });
  }
});

app.put('/api/references/:id', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { name, title, institution, phone } = req.body;
      await db.run(
        'UPDATE refs SET name = ?, title = ?, institution = ?, phone = ? WHERE id = ?',
        [name, title, institution, phone, req.params.id]
      );
      const ref = await db.get('SELECT * FROM refs WHERE id = ?', [req.params.id]);
      res.json({ success: true, data: ref });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reference' });
  }
});

app.delete('/api/references/:id', async (req, res) => {
  try {
    if (isDBConnected()) {
      await db.run('DELETE FROM refs WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Reference deleted' });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reference' });
  }
});

// Feedback Routes
app.get('/api/feedback', async (req, res) => {
  try {
    if (isDBConnected()) {
      const data = await db.all('SELECT * FROM feedback WHERE isApproved = 1 ORDER BY createdAt DESC');
      res.json({ success: true, data });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

app.get('/api/feedback/all', async (req, res) => {
  try {
    if (isDBConnected()) {
      const data = await db.all('SELECT * FROM feedback ORDER BY createdAt DESC');
      res.json({ success: true, data });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { clientName, clientRole, clientCompany, clientImage, feedbackText, rating, projectTitle } = req.body;
      if (!clientName || !feedbackText) {
        return res.status(400).json({ error: 'Client name and feedback text are required' });
      }

      const result = await db.run(
        'INSERT INTO feedback (clientName, clientRole, clientCompany, clientImage, feedbackText, rating, projectTitle, isApproved) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [clientName, clientRole, clientCompany, clientImage, feedbackText, rating || 5, projectTitle, 0]
      );
      const feedback = await db.get('SELECT * FROM feedback WHERE id = ?', [result.lastID]);
      res.status(201).json({ success: true, message: 'Feedback submitted successfully! It will be displayed after approval.', data: feedback });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

app.put('/api/feedback/:id', async (req, res) => {
  try {
    if (isDBConnected()) {
      const { isApproved } = req.body;
      await db.run('UPDATE feedback SET isApproved = ? WHERE id = ?', [isApproved ? 1 : 0, req.params.id]);
      const item = await db.get('SELECT * FROM feedback WHERE id = ?', [req.params.id]);
      res.json({ success: true, data: item });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

app.delete('/api/feedback/:id', async (req, res) => {
  try {
    if (isDBConnected()) {
      await db.run('DELETE FROM feedback WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'Feedback deleted' });
    } else {
      res.status(500).json({ error: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toDateString(), dbConnected: isDBConnected() });
});

// Serve static frontend (Vite build) if available
const distPath = path.join(process.cwd(), 'dist');
import fs from 'fs';

if (fs.existsSync(distPath)) {
  // Serve static assets with caching headers to improve performance
  app.use(express.static(distPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        // HTML should not be aggressively cached
        res.setHeader('Cache-Control', 'no-cache');
      } else if (filePath.match(/\.(js|css|svg|png|jpg|webp)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));

  // Return index.html for non-API routes (SPA fallback)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start server
const port = process.env.PORT || PORT;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
