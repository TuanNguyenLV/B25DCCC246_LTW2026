import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions }) => {
  const [level, setLevel] = useState('all');
  const [query, setQuery] = useState('');

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
  };

  const handleQueryShift = (e) => {
    setQuery(e.target.value);
  };

  const keyword = query.trim().toLowerCase();

  const filtered = questions.filter(
    (q) =>
      (level === 'all' || q.level === Number(level)) &&
      q.question.toLowerCase().includes(keyword)
  );

  return (
    <div className="question-bank">
      <h2>Ngân hàng câu hỏi</h2>
      <div className="filters">
        <label htmlFor="level">Mức độ</label>
        <select id="level" value={level} onChange={handleLevelChange}>
          <option value="all">Tất cả</option>
          <option value="1">{LEVELS[1]}</option>
          <option value="2">{LEVELS[2]}</option>
          <option value="3">{LEVELS[3]}</option>
        </select>
        <label htmlFor="search">Tìm kiếm</label>
        <input
          id="search"
          type="text"
          value={query}
          onChange={handleQueryShift}
          placeholder="Tìm theo nội dung câu hỏi"
        />
      </div>
      <p>{`Có ${filtered.length} câu hỏi`}</p>
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((q, i) => (
            <tr key={q.id}>
              <td>{i + 1}</td>
              <td>{LEVELS[q.level]}</td>
              <td>
                <Link to={`/questions/${q.id}`}>{q.question}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;