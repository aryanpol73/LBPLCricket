
-- Remove the 3 players from Puneri Paltan team
DELETE FROM players 
WHERE id IN (
  'c5a6ab0f-6bb8-487d-ae2a-4dab865d7f86',  -- Aryan Pol
  '3822346f-ffbb-46f9-863f-01c57c26ab7b',  -- Chetan Pol
  '80002e2c-39ab-4ffd-b481-cec3d16310bd'   -- Mandar Saoji
);
