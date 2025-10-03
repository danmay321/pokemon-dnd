import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'data', 'pokemon.db');
const db = new Database(dbPath, { readonly: true });

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slug } = req.query;
    if (!slug) {
      return res.status(400).json({ error: 'Slug parameter required' });
    }

    const row = db.prepare('SELECT * FROM pokemon WHERE lower(slug) = ? LIMIT 1').get(slug.toLowerCase());
    if (!row) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }

    res.status(200).json(row);
  } catch (err) {
    console.error('Error loading pokemon:', err);
    res.status(500).json({ error: 'Failed to load pokemon' });
  }
}