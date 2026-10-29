const Lifelines = ({
  status,
  usedFifty,
  usedAudience,
  onFifty,
  onAudience,
  onQuit,
}) => {
  const locked = status !== 'answering';
  return (
    <div className="lifelines">
      <button
        type="button"
        className="lifeline-btn"
        disabled={locked || usedFifty}
        onClick={onFifty}
      >
        50:50
      </button>
      <button
        type="button"
        className="lifeline-btn"
        disabled={locked || usedAudience}
        onClick={onAudience}
      >
        Hỏi khán giả
      </button>
      <button
        type="button"
        className="lifeline-btn quit"
        disabled={locked}
        onClick={onQuit}
      >
        Dừng cuộc chơi
      </button>
    </div>
  );
};

export default Lifelines;