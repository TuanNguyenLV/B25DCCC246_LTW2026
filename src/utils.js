import { MILESTONES, PRIZES } from './data';

export const calcPrize = (correctCount, reason) => {
  if (reason === 'win') {
    return PRIZES[PRIZES.length - 1];
  }
  if (reason === 'quit') {
    return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  }
  const reached = MILESTONES.filter((m) => m <= correctCount);
  return reached.length > 0 ? PRIZES[Math.max(...reached) - 1] : 0;
};

export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const pickHidden = (correctIndex) => {
  const wrong = [0, 1, 2, 3].filter((i) => i !== correctIndex);
  const shuffled = [...wrong].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
};

const splitRandom = (total, count) => {
  const cuts = Array.from({ length: count - 1 }, () => randomInt(0, total)).sort(
    (a, b) => a - b
  );
  const points = [0, ...cuts, total];
  return points.slice(1).map((p, i) => p - points[i]);
};

export const calcAudience = (correctIndex, hidden) => {
  const wrong = [0, 1, 2, 3].filter(
    (i) => i !== correctIndex && !hidden.includes(i)
  );
  const minCorrect = Math.max(40, Math.floor(100 / (wrong.length + 1)) + 1);
  const correctPct = randomInt(minCorrect, 70);
  const rest = 100 - correctPct;
  let parts = splitRandom(rest, wrong.length);
  let tries = 0;
  while (parts.some((p) => p >= correctPct) && tries < 100) {
    parts = splitRandom(rest, wrong.length);
    tries += 1;
  }
  return [0, 1, 2, 3].map((i) => {
    if (i === correctIndex) {
      return correctPct;
    }
    const pos = wrong.indexOf(i);
    return pos === -1 ? 0 : parts[pos];
  });
};