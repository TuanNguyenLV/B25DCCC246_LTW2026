import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { formatMoney } from '../data';

const MESSAGES = {
  win: 'Chúc mừng! Bạn đã trở thành triệu phú',
  wrong: 'Rất tiếc, bạn đã trả lời sai',
  timeout: 'Hết giờ!',
  quit: 'Bạn đã dừng cuộc chơi',
};

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { name, prize, correctCount, reason } = state;

  return (
    <div className="result">
      <h2>{MESSAGES[reason]}</h2>
      <p>{`Người chơi: ${name}`}</p>
      <p>{`Số câu trả lời đúng: ${correctCount}`}</p>
      <p>{`Tiền thưởng: ${formatMoney(prize)}`}</p>
      <div className="result-actions">
        <button type="button" onClick={() => navigate('/play')}>
          Chơi lại
        </button>
        <button type="button" onClick={() => navigate('/')}>
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default Result;