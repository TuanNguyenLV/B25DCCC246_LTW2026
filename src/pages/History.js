import { formatMoney } from '../data';

const History = ({ history, clearHistory }) => {
  const sorted = [...history].sort((a, b) => b.prize - a.prize);
  const maxPrize = history.reduce((max, r) => Math.max(max, r.prize), 0);
  const totalPrize = history.reduce((sum, r) => sum + r.prize, 0);

  return (
    <div className="history">
      <h2>Lịch sử các lượt chơi</h2>
      <p>{`Số lượt chơi: ${history.length}`}</p>
      <p>{`Tiền thưởng cao nhất: ${formatMoney(maxPrize)}`}</p>
      <p>{`Tổng tiền thưởng: ${formatMoney(totalPrize)}`}</p>
      {history.length === 0 ? (
        <p>Chưa có lượt chơi nào.</p>
      ) : (
        <>
          <button type="button" onClick={clearHistory}>
            Xóa lịch sử
          </button>
          <table>
            <thead>
              <tr>
                <th>Người chơi</th>
                <th>Số câu đúng</th>
                <th>Tiền thưởng</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.correctCount}</td>
                  <td>{formatMoney(r.prize)}</td>
                  <td>{r.playedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default History;