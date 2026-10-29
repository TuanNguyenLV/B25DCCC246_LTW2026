import { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('answering');
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const name = playerName.trim();
  const total = questions.length;
  const current = questions[index];

  const finish = useCallback(
    (reason, correctCount) => {
      const prize = calcPrize(correctCount, reason);
      navigate('/result', {
        replace: true,
        state: { name, prize, correctCount, reason },
      });
    },
    [navigate, name]
  );

  const handleSelect = (i) => {
    if (status !== 'answering') {
      return;
    }
    setSelected(i);
    setStatus('locked');
  };

  useEffect(() => {
    if (status !== 'answering') {
      return undefined;
    }
    const id = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) {
      setStatus('revealed');
    }
  }, [timeLeft, status]);

  useEffect(() => {
    if (status !== 'locked') {
      return undefined;
    }
    const id = setTimeout(() => {
      setStatus('revealed');
    }, 1000);
    return () => clearTimeout(id);
  }, [status]);

  useEffect(() => {
    if (status !== 'revealed' || !current) {
      return undefined;
    }
    const id = setTimeout(() => {
      if (selected === current.answer) {
        if (index + 1 >= total) {
          finish('win', index + 1);
          return;
        }
        setIndex(index + 1);
        setSelected(null);
        setStatus('answering');
        setTimeLeft(TIME_PER_QUESTION);
      } else {
        finish(selected === null ? 'timeout' : 'wrong', index);
      }
    }, 2000);
    return () => clearTimeout(id);
  }, [status, selected, index, current, total, finish]);

  if (name === '') {
    return <Navigate to="/" replace />;
  }

  if (!current) {
    return <p>Không có câu hỏi nào.</p>;
  }

  return (
    <div className="play">
      <div className="play-main">
        <Timer timeLeft={timeLeft} />
        <QuestionCard
          question={current}
          number={index + 1}
          total={total}
          hidden={[]}
          status={status}
          selected={selected}
          onSelect={handleSelect}
        />
      </div>
      <MoneyLadder current={index + 1} />
    </div>
  );
};

export default Play;