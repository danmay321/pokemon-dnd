import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'data', 'pokemon.db');
const db = new Database(dbPath, { readonly: true });

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const q = req.query.q ? `%${req.query.q}%` : '%';
    const rows = db.prepare(`SELECT id, pokedex_number, name, slug, description, base_height, base_weight, primary_type_id, secondary_type_id, base_constitution, base_strength, base_dexterity, base_intelligence, base_wisdom, base_charisma, armor_class, ground_speed, swimming_speed, flying_speed FROM pokemon WHERE name LIKE ? OR slug LIKE ? ORDER BY pokedex_number`).all(q, q);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error loading pokemon:', err);
    res.status(500).json({ error: 'Failed to load pokemon' });
  }
}