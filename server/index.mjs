import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 4000;

// CORS middleware - allow all origins for now to debug
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

const dbPath = path.resolve(process.cwd(), 'data', 'pokemon.db');
console.log('Looking for DB at:', dbPath);
console.log('Current working directory:', process.cwd());
console.log('Directory contents:', fs.readdirSync(process.cwd()));

let db;
try {
  db = new Database(dbPath, { readonly: true });
  console.log('Database opened successfully');
} catch (err) {
  console.error('Failed to open database:', err.message);
  console.error('This is likely why the server is failing');
  process.exit(1); // Exit with error so Railway knows deployment failed
}

// Log incoming requests (helps debug proxy / blocked requests)
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// sanity check: ensure required tables exist
try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name);
  const missing = [];
  for (const t of ['types','pokemon']) if (!tables.includes(t)) missing.push(t);
  if (missing.length) {
    console.error('Missing expected tables in DB:', missing.join(', '));
  } else {
    console.log('DB contains required tables: types, pokemon');
  }
} catch (err) {
  console.error('Error checking DB tables:', err && err.message);
}

app.get('/api/types', (req, res) => {
  try {
    const rows = db.prepare('SELECT id, name, color FROM types ORDER BY id').all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load types' });
  }
});

app.get('/api/pokemon', (req, res) => {
  try {
    const q = req.query.q ? `%${req.query.q}%` : '%';
    const rows = db.prepare(`SELECT id, pokedex_number, name, slug, description, base_height, base_weight, primary_type_id, secondary_type_id, base_constitution, base_strength, base_dexterity, base_intelligence, base_wisdom, base_charisma FROM pokemon WHERE name LIKE ? OR slug LIKE ? ORDER BY pokedex_number`).all(q, q);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load pokemon' });
  }
});

app.get('/api/pokemon/:slug', (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const row = db.prepare('SELECT * FROM pokemon WHERE lower(slug) = ? LIMIT 1').get(slug);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load pokemon', detail: err && err.message });
  }
});

// global error handler (JSON responses only)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Internal server error', detail: err && err.message });
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
