
CREATE TABLE IF NOT EXISTS public.movie_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,

    movie_id TEXT NOT NULL,
    movie_title TEXT NOT NULL,

    rating INTEGER NOT NULL
        CHECK (rating >= 1 AND rating <= 5),

    title TEXT,
    review_text TEXT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_movie_reviews_movie_id
ON public.movie_reviews(movie_id);

CREATE INDEX IF NOT EXISTS idx_movie_reviews_user_id
ON public.movie_reviews(user_id);

ALTER TABLE public.movie_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read movie reviews"
ON public.movie_reviews;

CREATE POLICY "Anyone can read movie reviews"
ON public.movie_reviews
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can create their own reviews"
ON public.movie_reviews;

CREATE POLICY "Users can create their own reviews"
ON public.movie_reviews
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reviews"
ON public.movie_reviews;

CREATE POLICY "Users can update their own reviews"
ON public.movie_reviews
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reviews"
ON public.movie_reviews;

CREATE POLICY "Users can delete their own reviews"
ON public.movie_reviews
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
