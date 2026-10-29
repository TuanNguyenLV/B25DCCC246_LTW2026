import AnswerButton from './AnswerButton';
import { LETTERS } from '../data';

const QuestionCard = ({
  question,
  number,
  total,
  hidden,
  status,
  selected,
  onSelect,
}) => {
  const getState = (i) => {
    if (hidden.includes(i)) {
      return 'hidden';
    }
    if (status === 'locked') {
      return i === selected ? 'selected' : '';
    }
    if (status === 'revealed') {
      if (i === question.answer) {
        return 'correct';
      }
      if (i === selected) {
        return 'wrong';
      }
    }
    return '';
  };

  return (
    <div className="question-card">
      <p className="question-number">{`Câu ${number}/${total}`}</p>
      <h2 className="question-text">{question.question}</h2>
      <div className="answer-grid">
        {question.options.map((option, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={option}
            state={getState(i)}
            disabled={status !== 'answering'}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;