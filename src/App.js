import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from './hooks/useFetch';
import useDebounce from './hooks/useDebounce';
import useLocalStorage from './hooks/useLocalStorage';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { selectMatches, setMatches, removeMatch, setGoals } from './features/matchesSlice';
import { hasSaved } from './store';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import MatchRow from './components/MatchRow';
import { ROUNDS, RESULT_LABELS } from './data';
import { getTeamName, calcStandings, calcMatchStats } from './utils';

const BUILD_TAG = "bd-5918";

const App = () => {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const { data, loading, error } = useFetch('/data/matches.json');
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const [roundFilter, setRoundFilter] = useLocalStorage('ltw_bongda_round', 'all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchRef = useRef(null);

  useEffect(() => {
    if (data && !hasSaved) dispatch(setMatches(data));
  }, [data, dispatch]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '/') {
        const tag = e.target.tagName;
        if (
          tag === 'INPUT' ||
          tag === 'SELECT' ||
          tag === 'TEXTAREA' ||
          e.target.isContentEditable
        ) {
          return;
        }
        if (searchRef.current) {
          e.preventDefault();
          searchRef.current.focus();
        }
      } else if (e.key === 'Escape') {
        if (searchRef.current && document.activeElement === searchRef.current) {
          setSearch('');
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const standings = useMemo(() => calcStandings(matches), [matches]);

  const filtered = useMemo(
    () =>
      roundFilter === 'all'
        ? matches
        : matches.filter((m) => m.round === Number(roundFilter)),
    [matches, roundFilter]
  );

  const visible = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return filtered.filter(
      (m) =>
        getTeamName(m.home).toLowerCase().includes(q) ||
        getTeamName(m.away).toLowerCase().includes(q)
    );
  }, [filtered, debouncedSearch]);

  const stats = useMemo(() => calcMatchStats(filtered), [filtered]);

  const leader = standings[0];

  useEffect(() => {
    document.title =
      matches.length > 0
        ? `${leader.name} dẫn đầu – Giải bóng đá khoa`
        : 'Giải bóng đá khoa';
  }, [matches.length, leader]);

  const handleTeamShift = (e) => {
    setSearch(e.target.value);
  };

  const handleGoals = useCallback(
    (id, homeGoals, awayGoals) => {
      dispatch(setGoals({ id, homeGoals, awayGoals }));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (m) => {
      dispatch(removeMatch(m.id));
      showNotice(`Đã xóa trận ${getTeamName(m.home)} - ${getTeamName(m.away)}`);
    },
    [dispatch, showNotice]
  );

  const handleReset = useCallback(() => {
    if (!data) return;
    dispatch(setMatches(data));
    showNotice('Đã đặt lại dữ liệu mẫu');
  }, [data, dispatch, showNotice]);

  let body;
  if (!hasSaved && loading) {
    body = <p>Đang tải lịch thi đấu...</p>;
  } else if (!hasSaved && error) {
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
          <h3>Phân bố kết quả</h3>
          <ul>
            {Object.entries(RESULT_LABELS).map(([key, label]) => (
              <li key={key}>
                {`${label}: ${stats.counts[key]}`}
                <span
                  style={{
                    display: 'inline-block',
                    marginLeft: 8,
                    height: 10,
                    width: `${24 * stats.counts[key]}px`,
                    background: '#1976d2',
                  }}
                />
              </li>
            ))}
          </ul>
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
          <div className="field">
            <label htmlFor="search">Tìm đội</label>
            <input
              id="search"
              type="text"
              ref={searchRef}
              value={search}
              onChange={handleTeamShift}
            />
          </div>
          <p>{`Tìm thấy ${visible.length} trận`}</p>
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
                  <th>Số lần render</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((m) => (
                  <MatchRow
                    key={m.id}
                    match={m}
                    onGoals={handleGoals}
                    onRemove={handleRemove}
                  />
                ))}
              </tbody>
            </table>
          )}
          <button type="button" onClick={handleReset}>
            Đặt lại dữ liệu mẫu
          </button>
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