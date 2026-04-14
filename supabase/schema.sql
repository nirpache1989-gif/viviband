-- ViviBand Database Schema
-- Run this in the Supabase SQL Editor to set up all tables

-- ============================================
-- TABLES
-- ============================================

-- Band info (singleton row)
CREATE TABLE band_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'ViviBand',
  bio_pt TEXT,
  bio_en TEXT,
  logo_url TEXT,
  instagram TEXT,
  youtube TEXT,
  facebook TEXT
);

-- Insert default row
INSERT INTO band_info (name) VALUES ('ViviBand');

-- Shows
CREATE TABLE shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMPTZ NOT NULL,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Portugal',
  ticket_url TEXT,
  is_past BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption_pt TEXT,
  caption_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Music
CREATE TABLE music (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  youtube_url TEXT,
  cover_url TEXT,
  release_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact info (singleton row)
CREATE TABLE contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  phone TEXT
);

-- Insert default contact row
INSERT INTO contact (email) VALUES ('contact@viviband.com');

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE band_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE music ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read band_info" ON band_info FOR SELECT USING (true);
CREATE POLICY "Public read shows" ON shows FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read music" ON music FOR SELECT USING (true);
CREATE POLICY "Public read contact" ON contact FOR SELECT USING (true);

-- Allow all operations with anon key (admin auth is handled at the API layer)
-- In production, consider using service_role key for admin operations
CREATE POLICY "Anon insert shows" ON shows FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update shows" ON shows FOR UPDATE USING (true);
CREATE POLICY "Anon delete shows" ON shows FOR DELETE USING (true);

CREATE POLICY "Anon insert gallery" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon delete gallery" ON gallery FOR DELETE USING (true);

CREATE POLICY "Anon insert music" ON music FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update music" ON music FOR UPDATE USING (true);
CREATE POLICY "Anon delete music" ON music FOR DELETE USING (true);

CREATE POLICY "Anon update band_info" ON band_info FOR UPDATE USING (true);

-- ============================================
-- STORAGE
-- ============================================

-- Create public storage bucket for images/logos
INSERT INTO storage.buckets (id, name, public) VALUES ('band-assets', 'band-assets', true);

-- Allow public read access to the bucket
CREATE POLICY "Public read band-assets" ON storage.objects FOR SELECT USING (bucket_id = 'band-assets');

-- Allow uploads and deletes (admin auth handled at API layer)
CREATE POLICY "Allow upload band-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'band-assets');
CREATE POLICY "Allow delete band-assets" ON storage.objects FOR DELETE USING (bucket_id = 'band-assets');
