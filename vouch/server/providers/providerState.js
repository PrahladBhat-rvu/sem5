let omdbRequests = 0;

let resetAt = getNextReset();

function getNextReset() {
  const now = new Date();

  const reset = new Date(now);

  reset.setUTCHours(0, 0, 0, 0);
  reset.setUTCDate(reset.getUTCDate() + 1);

  return reset.getTime();
}

export function canUseOMDb() {
  if (Date.now() >= resetAt) {
    omdbRequests = 0;
    resetAt = getNextReset();
  }

  return omdbRequests < 1000;
}

export function recordOMDbRequest() {
  omdbRequests++;
}

export function getOMDbUsage() {
  return {
    requests: omdbRequests,
    limit: 1000,
    remaining: Math.max(0, 1000 - omdbRequests),
  };
}

if (canUseOMDb()) {
    // OMDb
} else {
    // TMDB
}