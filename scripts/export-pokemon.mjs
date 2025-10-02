import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'data', 'pokemon.db');
const outPath = path.resolve(process.cwd(), 'src', 'data', 'pokemon.json');

const db = new Database(dbPath, { readonly: true });
const rows = db.prepare('SELECT id, pokedex_number, name, slug, description, base_height, base_weight, primary_type_id, secondary_type_id, base_constitution, base_strength, base_dexterity, base_intelligence, base_wisdom, base_charisma FROM pokemon ORDER BY pokedex_number').all();
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), 'utf-8');
console.log('Exported', rows.length, 'pokemon to', outPath);
db.close();

// also export types table
const typesOut = path.resolve(process.cwd(), 'src', 'data', 'types.json');
const typesRows = new Database(dbPath, { readonly: true }).prepare('SELECT id, name, color FROM types').all();
fs.writeFileSync(typesOut, JSON.stringify(typesRows, null, 2), 'utf-8');
console.log('Exported', typesRows.length, 'types to', typesOut);
