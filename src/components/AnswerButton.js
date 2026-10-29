const AnswerButton = ({ letter, text, state, disabled, onClick }) => {
  const isHidden = state === 'hidden';
  return (
    <button
      type="button"
      className={`answer-btn ${state}`}
      disabled={disabled || isHidden}
      onClick={onClick}
    >
      {isHidden ? '' : `${letter}. ${text}`}
    </button>
  );
};

export default AnswerButton;