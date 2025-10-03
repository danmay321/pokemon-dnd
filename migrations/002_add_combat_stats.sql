-- Add combat stats to pokemon table
ALTER TABLE pokemon ADD COLUMN armor_class INTEGER DEFAULT 10;
ALTER TABLE pokemon ADD COLUMN ground_speed INTEGER DEFAULT 30;
ALTER TABLE pokemon ADD COLUMN swimming_speed INTEGER DEFAULT 0;
ALTER TABLE pokemon ADD COLUMN flying_speed INTEGER DEFAULT 0;