import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.resolve(process.cwd(), 'data', 'pokemon.db');
const migrationsPath = path.resolve(process.cwd(), 'migrations', '001_create_tables.sql');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

const sql = fs.readFileSync(migrationsPath, 'utf-8');
db.exec(sql);

// seed basic types
const types = [
  ['Normal', '#e6e0d4'],
  ['Fire', '#fb923c'],
  ['Water', '#38bdf8'],
  ['Electric', '#facc15'],
  ['Grass', '#22c55e'],
  ['Ice', '#99f6e4'],
  ['Fighting', '#fb923c'],
  ['Poison', '#a78bfa'],
  ['Ground', '#f59e0b'],
  ['Flying', '#6366f1'],
  ['Psychic', '#f472b6'],
  ['Bug', '#34d399'],
  ['Rock', '#a8a29e'],
  ['Ghost', '#4338ca'],
  ['Dragon', '#7c3aed'],
  ['Dark', '#334155'],
  ['Steel', '#9ca3af'],
  ['Fairy', '#f9a8d4']
];
const insertType = db.prepare('INSERT OR IGNORE INTO types (name, color) VALUES (?, ?)');
for (const t of types) insertType.run(t[0], t[1]);

// seed the first 151 Pokémon from the PokéAPI
const getTypeId = db.prepare('SELECT id FROM types WHERE name = ?');
const insertPokemon = db.prepare(
  `INSERT OR IGNORE INTO pokemon (
    pokedex_number, name, slug, description, base_height, base_weight,
    primary_type_id, secondary_type_id, evolves_to_id,
    base_constitution, base_strength, base_dexterity, base_intelligence, base_wisdom, base_charisma
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

// helper to capitalize type names from API (api returns lowercase)
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

async function seedFirst151() {
  const listRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
  const listJson = await listRes.json();
  const promises = listJson.results.map(async (p, idx) => {
    const detailRes = await fetch(p.url);
    const detail = await detailRes.json();
    const types = detail.types.map(t => capitalize(t.type.name));
    const primary = types[0] || null;
    const secondary = types[1] || null;
    const primaryIdRow = primary ? getTypeId.get(primary) : null;
    const secondaryIdRow = secondary ? getTypeId.get(secondary) : null;
    const primaryId = primaryIdRow ? primaryIdRow.id : null;
    const secondaryId = secondaryIdRow ? secondaryIdRow.id : null;

    // height is in decimeters, weight in hectograms in the API — convert to meters/kg
    const height = detail.height ? detail.height / 10 : null;
    const weight = detail.weight ? detail.weight / 10 : null;

    insertPokemon.run(
      idx + 1,
      detail.name,
      detail.name,
      detail.species ? detail.species.name : null,
      height,
      weight,
      primaryId,
      secondaryId,
      null,
      0,0,0,0,0,0
    );
  });
  await Promise.all(promises);
}

// run the async seeding and wait
await seedFirst151();

console.log('Database initialized at', dbPath);
db.close();
