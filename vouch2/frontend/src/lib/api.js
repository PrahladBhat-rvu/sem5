
import { supabase } from "./supabase";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

async function apiRequest(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}

function formatReview(review) {
  return {
    id: review.id,
    user: review.userId || "local-user",
    name: review.name || "Anonymous Cinephile",
    rating: review.rating,
    date: review.createdAt
      ? new Date(review.createdAt).toLocaleDateString()
      : "Recently",
    title: review.title,
    text: review.text,
    likes: review.likes || 0,
    isLiked: false,
    verified: false,
    movieId: review.movieId,
    movieTitle: review.movieTitle,
  };
}

export async function getMovieReviews(movieId) {
  const data = await apiRequest(
    `/api/reviews?movieId=${encodeURIComponent(movieId)}`
  );

  return (data.reviews || []).map(formatReview);
}

export async function createMovieReview(review) {
  const { data: { session } } = await supabase.auth.getSession();

  const payload = {
    ...review,
    userId: session?.user?.id || "local-demo-user",
    name: review.name || session?.user?.user_metadata?.display_name || "Demo User",
  };

  const data = await apiRequest("/api/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return formatReview(data.review);
}

export async function updateMovieReview(id, updates) {
  const data = await apiRequest(`/api/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

  return formatReview(data.review);
}

export async function deleteMovieReview(id) {
  return apiRequest(`/api/reviews/${id}`, {
    method: "DELETE",
  });
}

export async function getBackendCurrentUser() {
  return apiRequest("/api/auth/me");
}

export async function getUserProfile() {
  return apiRequest("/api/profile");
}

export async function updateUserProfile(profile) {
  const data = await apiRequest("/api/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });

  return data.profile;
}

export async function getMyMovieReviews(userId) {
  const data = await apiRequest("/api/reviews");

  return (data.reviews || [])
    .filter((review) => review.userId === userId)
    .map((review) => ({
      ...review,
      date: review.createdAt
        ? new Date(review.createdAt).toLocaleDateString()
        : "Recently",
      movieSlug: review.movieSlug || "",
      mediaType: review.mediaType || "movie",
    }));
}