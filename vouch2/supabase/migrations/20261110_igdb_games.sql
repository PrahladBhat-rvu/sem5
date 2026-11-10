-- Migration: IGDB Games Integration for Vouch
-- Tables for game reviews, ratings, user collections, and wishlists

-- 1. Game Reviews
CREATE TABLE IF NOT EXISTS public.game_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  game_title TEXT NOT NULL,
  rating NUMERIC(3, 1) CHECK (rating >= 0 AND rating <= 10),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_reviews_game_id ON public.game_reviews(game_id);
CREATE INDEX IF NOT EXISTS idx_game_reviews_user_id ON public.game_reviews(user_id);

-- 2. Game Ratings
CREATE TABLE IF NOT EXISTS public.game_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  rating NUMERIC(3, 1) NOT NULL CHECK (rating >= 0 AND rating <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, game_id)
);

CREATE INDEX IF NOT EXISTS idx_game_ratings_game_id ON public.game_ratings(game_id);

-- 3. User Game Collections
CREATE TABLE IF NOT EXISTS public.game_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  game_title TEXT NOT NULL,
  game_cover TEXT,
  status TEXT DEFAULT 'played' CHECK (status IN ('playing', 'completed', 'backlog', 'played')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, game_id)
);

CREATE INDEX IF NOT EXISTS idx_game_collections_user ON public.game_collections(user_id);

-- 4. User Game Wishlists
CREATE TABLE IF NOT EXISTS public.game_wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  game_title TEXT NOT NULL,
  game_cover TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, game_id)
);

CREATE INDEX IF NOT EXISTS idx_game_wishlists_user ON public.game_wishlists(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.game_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_wishlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Game reviews: anyone can read, authenticated authors can insert/update/delete
CREATE POLICY "Public read game reviews" ON public.game_reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert game reviews" ON public.game_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own game reviews" ON public.game_reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own game reviews" ON public.game_reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Game ratings: anyone can read, authenticated authors can manage own ratings
CREATE POLICY "Public read game ratings" ON public.game_ratings FOR SELECT USING (true);
CREATE POLICY "Users can insert own game rating" ON public.game_ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own game rating" ON public.game_ratings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own game rating" ON public.game_ratings FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Game collections: users manage their own collections
CREATE POLICY "Users can read own game collections" ON public.game_collections FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own game collections" ON public.game_collections FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own game collections" ON public.game_collections FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own game collections" ON public.game_collections FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Game wishlists: users manage their own wishlists
CREATE POLICY "Users can read own game wishlists" ON public.game_wishlists FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own game wishlists" ON public.game_wishlists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own game wishlists" ON public.game_wishlists FOR DELETE TO authenticated USING (auth.uid() = user_id);

