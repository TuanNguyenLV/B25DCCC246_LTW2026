import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMatch, selectMatches } from '../features/matchesSlice';
import { useNotice } from '../context/NoticeContext';
import { TEAMS, ROUNDS } from '../data';
import { getTeamName, isValidGoals } from '../utils';

const emptyForm = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };

const AddMatchForm = () => {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const showNotice = useNotice();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const homeRef = useRef(null);

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

    const home = Number(form.home);
    const away = Number(form.away);
    dispatch(addMatch({ round: Number(form.round), home, away, homeGoals, awayGoals }));
    showNotice(`Đã thêm trận ${getTeamName(home)} - ${getTeamName(away)}`);
    setForm(emptyForm);
    homeRef.current.focus();
  };

  return (
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
        <select id="home" name="home" ref={homeRef} value={form.home} onChange={handleField}>
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
  );
};

export default AddMatchForm;