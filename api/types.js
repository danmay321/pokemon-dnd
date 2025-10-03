import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'data', 'pokemon.db');
const db = new Database(dbPath, { readonly: true });

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rows = db.prepare('SELECT id, name, color FROM types ORDER BY id').all();
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error loading types:', err);
    res.status(500).json({ error: 'Failed to load types' });
  }
}