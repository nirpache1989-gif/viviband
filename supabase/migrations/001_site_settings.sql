-- Migration 001: add site-appearance settings to band_info
-- Run this in the Supabase SQL Editor if you've already created the band_info
-- table from schema.sql without these columns.
-- Safe to run multiple times.

ALTER TABLE band_info
  ADD COLUMN IF NOT EXISTS site_palette TEXT DEFAULT 'neon',
  ADD COLUMN IF NOT EXISTS site_display_font TEXT DEFAULT 'bricolage',
  ADD COLUMN IF NOT EXISTS site_grain INTEGER DEFAULT 7;

-- Backfill defaults for the existing singleton row if any value is NULL
UPDATE band_info
  SET site_palette = COALESCE(site_palette, 'neon'),
      site_display_font = COALESCE(site_display_font, 'bricolage'),
      site_grain = COALESCE(site_grain, 7);
