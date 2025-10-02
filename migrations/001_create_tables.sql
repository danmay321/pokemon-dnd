-- Create types table
CREATE TABLE IF NOT EXISTS types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  color TEXT
);

-- Create pokemon table
CREATE TABLE IF NOT EXISTS pokemon (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pokedex_number INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  base_height REAL,
  base_weight REAL,
  primary_type_id INTEGER NOT NULL,
  secondary_type_id INTEGER,
  -- single evolve target (nullable). For multi-target evolutions use a separate relation table.
  evolves_to_id INTEGER,
  -- base ability scores (D&D-style bases)
  base_constitution INTEGER DEFAULT 0,
  base_strength INTEGER DEFAULT 0,
  base_dexterity INTEGER DEFAULT 0,
  base_intelligence INTEGER DEFAULT 0,
  base_wisdom INTEGER DEFAULT 0,
  base_charisma INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (primary_type_id) REFERENCES types(id),
  FOREIGN KEY (secondary_type_id) REFERENCES types(id),
  FOREIGN KEY (evolves_to_id) REFERENCES pokemon(id)
);

-- Create moves table
-- (moves table intentionally omitted for now)

-- Placeholder table for pokemon_moves. Currently only contains a primary key
-- and will be expanded later to reference moves or carry move metadata.
CREATE TABLE IF NOT EXISTS pokemon_moves (
  id INTEGER PRIMARY KEY AUTOINCREMENT
);
