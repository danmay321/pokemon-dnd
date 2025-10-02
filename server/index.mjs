import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';

const app = express();
const port = process.env.PORT || 4000;

// Simple CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const dbPath = path.resolve(process.cwd(), 'data', 'pokemon.db');
const db = new Database(dbPath, { readonly: true });

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
    res.status(500).json({ error: 'Failed to load pokemon' });
  }
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
