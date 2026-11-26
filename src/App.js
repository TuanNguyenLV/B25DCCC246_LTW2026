import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import useFetch from './hooks/useFetch';
import matchesReducer from './matchesReducer';
import { TEAMS, ROUNDS, RESULT_LABELS, formatDiff } from './data';
import {
  getTeamName,
  getResult,
  isValidGoals,
  calcStandings,
  calcMatchStats,
} from './utils';

const BUILD_TAG = "bd-5918";

const emptyForm = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };

const App = () => {
  const { data, loading, error } = useFetch('/data/matches.json');
  const [matches, dispatch] = useReducer(matchesReducer, []);
  const [roundFilter, setRoundFilter] = useState('all');
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const homeRef = useRef(null);

  useEffect(() => {
    if (data) dispatch({ type: 'LOAD', payload: data });
  }, [data]);

  const standings = useMemo(() => calcStandings(matches), [matches]);

  const visible = useMemo(
    () =>
      roundFilter === 'all'
        ? matches
        : matches.filter((m) => m.round === Number(roundFilter)),
    [matches, roundFilter]
  );

  const stats = useMemo(() => calcMatchStats(visible), [visible]);

  const leader = standings[0];

  const handleField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.home === '') next.home = 'Hãy chọn đội nhà';
    if (form.away === '') {
      next.away = 'Hãy chọn đội khách';
    } else if (form.home !== '' && form.home === form.away) {
      next.away = 'Hai đội phải khác nhau';
    } else if (
      form.home !== '' &&
      matches.some(
        (m) =>
          (m.home === Number(form.home) && m.away === Number(form.away)) ||
          (m.home === Number(form.away) && m.away === Number(form.home))
      )
    ) {
      next.away = 'Hai đội đã đá với nhau rồi';
    }
    const homeGoals = form.homeGoals === '' ? NaN : Number(form.homeGoals);
    const awayGoals = form.awayGoals === '' ? NaN : Number(form.awayGoals);
    if (!isValidGoals(homeGoals)) {
      next.homeGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    }
    if (!isValidGoals(awayGoals)) {
      next.awayGoals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    dispatch({
      type: 'ADD',
      payload: {
        round: Number(form.round),
        home: Number(form.home),
        away: Number(form.away),
        homeGoals,
        awayGoals,
      },
    });
    setForm(emptyForm);
    homeRef.current.focus();
  };

  let body;
  if (loading) {
    body = <p>Đang tải lịch thi đấu...</p>;
  } else if (error) {
    body = <p>Không tải được lịch thi đấu.</p>;
  } else {
    body = (
      <>
        <section>
          <h2>Bảng xếp hạng</h2>
          <table>
            <thead>
              <tr>
                <th>Hạng</th>
                <th>Đội</th>
                <th>Trận</th>
                <th>Thắng</th>
                <th>Hòa</th>
                <th>Thua</th>
                <th>BT</th>
                <th>BB</th>
                <th>HS</th>
                <th>Điểm</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row, index) => (
                <tr
                  key={row.id}
                  style={index === standings.length - 1 ? { color: '#c62828' } : undefined}
                >
                  <td>{index + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.played}</td>
                  <td>{row.won}</td>
                  <td>{row.drawn}</td>
                  <td>{row.lost}</td>
                  <td>{row.gf}</td>
                  <td>{row.ga}</td>
                  <td>{formatDiff(row.diff)}</td>
                  <td>{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>Thống kê</h2>
          <p>{`Số trận: ${stats.count}`}</p>
          <p>{`Tổng số bàn thắng: ${stats.goals}`}</p>
          <p>{`Bàn thắng mỗi trận: ${stats.average.toFixed(2)}`}</p>
          <p>
            {matches.length === 0
              ? 'Đội dẫn đầu: —'
              : `Đội dẫn đầu: ${leader.name} (${leader.points} điểm)`}
          </p>
        </section>

        <section>
          <h2>Lịch thi đấu</h2>
          <div className="field">
            <label htmlFor="roundFilter">Xem vòng</label>
            <select
              id="roundFilter"
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {ROUNDS.map((r) => (
                <option key={r} value={r}>{`Vòng ${r}`}</option>
              ))}
            </select>
          </div>
          {visible.length === 0 ? (
            <p>Chưa có trận đấu nào</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Vòng</th>
                  <th>Đội nhà</th>
                  <th>BT nhà</th>
                  <th>BT khách</th>
                  <th>Đội khách</th>
                  <th>Kết quả</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((m) => (
                  <tr
                    key={m.id}
                    style={
                      getResult(m) === 'draw'
                        ? { background: 'rgba(255, 193, 7, 0.25)' }
                        : undefined
                    }
                  >
                    <td>{m.round}</td>
                    <td>{getTeamName(m.home)}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={m.homeGoals}
                        aria-label={`Bàn thắng nhà ${getTeamName(m.home)} - ${getTeamName(m.away)}`}
                        onChange={(e) => {
                          const v = e.target.valueAsNumber;
                          if (isValidGoals(v)) {
                            dispatch({
                              type: 'SET_GOALS',
                              payload: { id: m.id, homeGoals: v, awayGoals: m.awayGoals },
                            });
                          }
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={m.awayGoals}
                        aria-label={`Bàn thắng khách ${getTeamName(m.home)} - ${getTeamName(m.away)}`}
                        onChange={(e) => {
                          const v = e.target.valueAsNumber;
                          if (isValidGoals(v)) {
                            dispatch({
                              type: 'SET_GOALS',
                              payload: { id: m.id, homeGoals: m.homeGoals, awayGoals: v },
                            });
                          }
                        }}
                      />
                    </td>
                    <td>{getTeamName(m.away)}</td>
                    <td>{RESULT_LABELS[getResult(m)]}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'REMOVE', payload: m.id })}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section>
          <h2>Thêm trận đấu</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="round">Vòng</label>
              <select id="round" name="round" value={form.round} onChange={handleField}>
                {ROUNDS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="home">Đội nhà</label>
              <select
                id="home"
                name="home"
                ref={homeRef}
                value={form.home}
                onChange={handleField}
              >
                <option value="">-- Chọn đội --</option>
                {TEAMS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              {errors.home && (
                <div role="alert" className="error">
                  {errors.home}
                </div>
              )}
            </div>
            <div className="field">
              <label htmlFor="away">Đội khách</label>
              <select id="away" name="away" value={form.away} onChange={handleField}>
                <option value="">-- Chọn đội --</option>
                {TEAMS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              {errors.away && (
                <div role="alert" className="error">
                  {errors.away}
                </div>
              )}
            </div>
            <div className="field">
              <label htmlFor="homeGoals">Bàn thắng đội nhà</label>
              <input
                id="homeGoals"
                name="homeGoals"
                type="number"
                value={form.homeGoals}
                onChange={handleField}
              />
              {errors.homeGoals && (
                <div role="alert" className="error">
                  {errors.homeGoals}
                </div>
              )}
            </div>
            <div className="field">
              <label htmlFor="awayGoals">Bàn thắng đội khách</label>
              <input
                id="awayGoals"
                name="awayGoals"
                type="number"
                value={form.awayGoals}
                onChange={handleField}
              />
              {errors.awayGoals && (
                <div role="alert" className="error">
                  {errors.awayGoals}
                </div>
              )}
            </div>
            <button type="submit">Thêm trận</button>
          </form>
        </section>
      </>
    );
  }

  return (
    <div className="app" data-build={BUILD_TAG}>
      <h1>Giải bóng đá khoa</h1>
      {body}
    </div>
  );
};

export default App;