const ADJECTIVES = [
  "Velvet",
  "Cosmic",
  "Silent",
  "Electric",
  "Cinematic",
  "Nocturnal",
  "Golden",
  "Curious",
  "Vintage",
  "Mystic",
  "Fierce",
  "Luminous",
  "Silver",
  "Retro",
  "Astral",
  "Vivid",
  "Echoing",
  "Dynamic",
  "Neon",
  "Starlight",
  "Infinite",
  "Obscure",
  "Midnight",
];

const NOUNS = [
  "Auteur",
  "Director",
  "Cinephile",
  "Reel",
  "Voyager",
  "Viewer",
  "Projector",
  "Critic",
  "Spectator",
  "Archivist",
  "Nomad",
  "Screenplay",
  "Framesmith",
  "Visionary",
  "Filmgoer",
  "Cinematics",
  "Chronicle",
  "Protagonist",
];

export function generateRandomUsername() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(100 + Math.random() * 900); // 3-digit number (100-999)
  const separator = Math.random() > 0.5 ? "_" : "";
  return `${adj}${separator}${noun}_${num}`;
}

export function generateUsernameSuggestions(count = 3) {
  const set = new Set();
  while (set.size < count) {
    set.add(generateRandomUsername());
  }
  return Array.from(set);
}

