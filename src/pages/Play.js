import { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';
import { LETTERS, TIME_PER_QUESTION } from '../data';
import { calcPrize, calcAudience, pickHidden } from '../utils';

const Play = ({ questions, playerName, addRecord }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('answering');
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [hidden, setHidden] = useState([]);
  const [audience, setAudience] = useState(null);
  const [usedFifty, setUsedFifty] = useState(false);
  const [usedAudience, setUsedAudience] = useState(false);

  const name = playerName.trim();
  const total = questions.length;
  const current = questions[index];

  const finish = useCallback(
    (reason, correctCount) => {
      const prize = calcPrize(correctCount, reason);
      addRecord({
        id: Date.now(),
        name,
        prize,
        correctCount,
        playedAt: new Date().toLocaleString('vi-VN'),
      });
      navigate('/result', {
        replace: true,
        state: { name, prize, correctCount, reason },
      });
    },
    [addRecord, navigate, name]
  );

  const handleSelect = useCallback(
    (i) => {
      if (status !== 'answering' || hidden.includes(i)) {
        return;
      }
      setSelected(i);
      setStatus('locked');
    },
    [status, hidden]
  );

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
        setHidden([]);
        setAudience(null);
      } else {
        finish(selected === null ? 'timeout' : 'wrong', index);
      }
    }, 2000);
    return () => clearTimeout(id);
  }, [status, selected, index, current, total, finish]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      const i = LETTERS.indexOf(e.key.toUpperCase());
      if (i === -1) {
        return;
      }
      handleSelect(i);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleSelect]);

  useEffect(() => {
    if (name === '') {
      return undefined;
    }
    document.title = `Câu ${index + 1}/${total} – ${name}`;
    return () => {
      document.title = 'Ai là triệu phú';
    };
  }, [index, total, name]);

  const handleFifty = () => {
    if (status !== 'answering' || usedFifty) {
      return;
    }
    setHidden(pickHidden(current.answer));
    setUsedFifty(true);
  };

  const handleAudience = () => {
    if (status !== 'answering' || usedAudience) {
      return;
    }
    setAudience(calcAudience(current.answer, hidden));
    setUsedAudience(true);
  };

  const handleQuit = () => {
    if (status !== 'answering') {
      return;
    }
    finish('quit', index);
  };

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
          hidden={hidden}
          status={status}
          selected={selected}
          onSelect={handleSelect}
        />
        <Lifelines
          status={status}
          usedFifty={usedFifty}
          usedAudience={usedAudience}
          onFifty={handleFifty}
          onAudience={handleAudience}
          onQuit={handleQuit}
        />
        {audience && <AudienceChart percents={audience} />}
      </div>
      <MoneyLadder current={index + 1} />
    </div>
  );
};

export default Play;