-- Migration: Add ON DELETE CASCADE to event.openday_fk foreign key

-- 1. Drop the existing foreign key constraint (name may vary, adjust if needed)
ALTER TABLE event DROP CONSTRAINT IF EXISTS event_openday_fk_fkey;

-- 2. Add the new foreign key constraint with ON DELETE CASCADE
ALTER TABLE event
ADD CONSTRAINT event_openday_fk_fkey
FOREIGN KEY (openday_fk)
REFERENCES openday(id)
ON DELETE CASCADE;
