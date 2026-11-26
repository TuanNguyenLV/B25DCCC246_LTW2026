import { TEAMS, MAX_GOALS } from './data';

export const getTeamName = (id) => {
  const team = TEAMS.find((t) => t.id === id);
  return team ? team.name : '';
};

export const getResult = ({ homeGoals, awayGoals }) => {
  if (homeGoals > awayGoals) return 'home';
  if (homeGoals < awayGoals) return 'away';
  return 'draw';
};

export const isValidGoals = (n) => Number.isInteger(n) && n >= 0 && n <= MAX_GOALS;

export const calcStandings = (matches) => {
  const rows = TEAMS.map((t) => ({
    id: t.id,
    name: t.name,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    diff: 0,
    points: 0,
  }));

  matches.forEach((m) => {
    const home = rows.find((r) => r.id === m.home);
    const away = rows.find((r) => r.id === m.away);
    if (!home || !away) return;
    home.played += 1;
    away.played += 1;
    home.gf += m.homeGoals;
    home.ga += m.awayGoals;
    away.gf += m.awayGoals;
    away.ga += m.homeGoals;
    const result = getResult(m);
    if (result === 'home') {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (result === 'away') {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  });

  return rows
    .map((r) => ({ ...r, diff: r.gf - r.ga }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.diff - a.diff ||
        b.gf - a.gf ||
        a.name.localeCompare(b.name, 'vi')
    );
};

export const calcMatchStats = (matches) => {
  const counts = { home: 0, draw: 0, away: 0 };
  let goals = 0;
  matches.forEach((m) => {
    goals += m.homeGoals + m.awayGoals;
    counts[getResult(m)] += 1;
  });
  const count = matches.length;
  const average = count === 0 ? 0 : Math.round((goals / count) * 100) / 100;
  return { count, goals, average, counts };
};
export const calcNeeded = (standings, teamId, target, remaining) => {
  const invalidMessage =
    'Hãy chọn đội, nhập số điểm mục tiêu (từ 0) và số trận còn lại (từ 1)';
  const row = standings.find((r) => String(r.id) === String(teamId));
  const goal = Number(target);
  const left = Number(remaining);
  if (
    !row ||
    String(target).trim() === '' ||
    !Number.isInteger(goal) ||
    goal < 0 ||
    String(remaining).trim() === '' ||
    !Number.isInteger(left) ||
    left < 1
  ) {
    return invalidMessage;
  }
  const need = goal - row.points;
  if (need <= 0) return 'Đội đã đạt mục tiêu';
  if (need > 3 * left) return 'Không thể đạt mục tiêu này';
  const wins = Math.max(0, Math.ceil((need - left) / 2));
  return `Cần thêm ${need} điểm ở ${left} trận còn lại, tối thiểu ${wins} trận thắng`;
};