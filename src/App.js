import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from './hooks/useFetch';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { selectMatches, setMatches, removeMatch, setGoals } from './features/matchesSlice';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import { ROUNDS, RESULT_LABELS } from './data';
import {
  getTeamName,
  getResult,
  isValidGoals,
  calcStandings,
  calcMatchStats,
} from './utils';

const BUILD_TAG = "bd-5918";

const App = () => {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const { data, loading, error } = useFetch('/data/matches.json');
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const [roundFilter, setRoundFilter] = useState('all');

  useEffect(() => {
    if (data) dispatch(setMatches(data));
  }, [data, dispatch]);

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

  const handleRemove = (m) => {
    dispatch(removeMatch(m.id));
    showNotice(`Đã xóa trận ${getTeamName(m.home)} - ${getTeamName(m.away)}`);
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
          <StandingsTable standings={standings} />
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
                            dispatch(
                              setGoals({ id: m.id, homeGoals: v, awayGoals: m.awayGoals })
                            );
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
                            dispatch(
                              setGoals({ id: m.id, homeGoals: m.homeGoals, awayGoals: v })
                            );
                          }
                        }}
                      />
                    </td>
                    <td>{getTeamName(m.away)}</td>
                    <td>{RESULT_LABELS[getResult(m)]}</td>
                    <td>
                      <button type="button" onClick={() => handleRemove(m)}>
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
          <AddMatchForm />
        </section>

        <section>
          <h2>Mục tiêu điểm</h2>
          <GoalPlanner standings={standings} />
        </section>
      </>
    );
  }

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <h1>Giải bóng đá khoa</h1>
      <button type="button" onClick={toggleTheme}>
        {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
      </button>
      {body}
    </div>
  );
};

export default App;