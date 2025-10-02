import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'data', 'pokemon.db');
const db = new Database(dbPath);

const stmt = db.prepare(`
  UPDATE pokemon
  SET
    base_constitution = 0,
    base_strength = 0,
    base_dexterity = 0,
    base_intelligence = 0,
    base_wisdom = 0,
    base_charisma = 0
  WHERE
    COALESCE(base_constitution,0) != 0
    OR COALESCE(base_strength,0) != 0
    OR COALESCE(base_dexterity,0) != 0
    OR COALESCE(base_intelligence,0) != 0
    OR COALESCE(base_wisdom,0) != 0
    OR COALESCE(base_charisma,0) != 0
`);

const info = stmt.run();
console.log('Rows updated:', info.changes);
db.close();
