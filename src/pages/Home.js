import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();

  const best = history.reduce(
    (top, record) => (top === null || record.prize > top.prize ? record : top),
    null
  );

  const handleChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() === '') {
      return;
    }
    navigate('/play');
  };

  return (
    <div className="home">
      <h1>Ai là triệu phú</h1>
      <ul className="rules">
        <li>Trả lời lần lượt 15 câu hỏi trắc nghiệm, mỗi câu có 30 giây.</li>
        <li>Trả lời đúng để leo lên bậc tiền thưởng tiếp theo, câu 15 trị giá 250.000.000 đ.</li>
        <li>Câu 5, 10, 15 là các mốc an toàn.</li>
        <li>Trả lời sai hoặc hết giờ chỉ nhận tiền của mốc an toàn cao nhất đã vượt qua.</li>
        <li>Có 3 quyền trợ giúp: 50:50, Hỏi khán giả và Dừng cuộc chơi để mang tiền về.</li>
        <li>Bấm phím A, B, C, D để chọn nhanh đáp án.</li>
      </ul>
      {best && (
        <p className="record">{`Kỷ lục: ${formatMoney(best.prize)} – ${best.name}`}</p>
      )}
      <form onSubmit={handleSubmit} className="name-form">
        <label htmlFor="player-name">Tên người chơi</label>
        <input
          id="player-name"
          type="text"
          value={playerName}
          onChange={handleChange}
          placeholder="Nhập tên của bạn"
        />
        <button type="submit" disabled={playerName.trim() === ''}>
          Bắt đầu
        </button>
      </form>
    </div>
  );
};

export default Home;