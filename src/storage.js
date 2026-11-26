const MATCHES_KEY = 'ltw_bongda_matches';

export const loadSaved = () => {
  try {
    const raw = localStorage.getItem(MATCHES_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    return null;
  }
};

export const saveMatches = (matches) => {
  try {
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  } catch (err) {
    return;
  }
};