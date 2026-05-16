import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool, query } from "./pool";

async function setup() {
  await query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('donor', 'receiver')),
      location TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS donations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      donor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      location TEXT NOT NULL,
      donor_phone TEXT,
      pickup_window TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'picked_up', 'expired')),
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS claims (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
      receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
      approval_code TEXT,
      ai_plan JSONB,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    ALTER TABLE donations ADD COLUMN IF NOT EXISTS donor_phone TEXT;
    ALTER TABLE claims ADD COLUMN IF NOT EXISTS approval_code TEXT;
    ALTER TABLE claims DROP CONSTRAINT IF EXISTS claims_status_check;
    ALTER TABLE claims ADD CONSTRAINT claims_status_check CHECK (status IN ('pending', 'approved', 'rejected', 'completed'));
  `);

  const donorPassword = await bcrypt.hash("password123", 10);
  const receiverPassword = await bcrypt.hash("password123", 10);

  await query(
    `INSERT INTO users (name, email, password_hash, role, location)
     VALUES
      ('Aaranya Foods', 'donor@sharebite.dev', $1, 'donor', 'Kukatpally, Hyderabad'),
      ('Seva Kitchen', 'receiver@sharebite.dev', $2, 'receiver', 'Ameerpet, Hyderabad')
     ON CONFLICT (email) DO NOTHING`,
    [donorPassword, receiverPassword]
  );

  await query(`
    INSERT INTO donations (donor_id, title, category, quantity, location, donor_phone, pickup_window, expires_at, notes)
    SELECT id, 'Fresh biryani meal boxes', 'Cooked meals', 42, 'Kukatpally, Hyderabad', '+91 90000 00000', 'Today 7:00 PM - 9:00 PM', now() + interval '6 hours', 'Packed and ready for NGO pickup.'
    FROM users WHERE email='donor@sharebite.dev'
    ON CONFLICT DO NOTHING
  `);

  console.log("ShareBite database is ready.");
}

setup().finally(() => pool.end());
