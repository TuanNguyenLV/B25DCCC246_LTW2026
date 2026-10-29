import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const question = questions.find((q) => q.id === Number(id));

  return (
    <div className="question-detail">
      {question ? (
        <>
          <h2>{`Câu hỏi số ${question.id} (${LEVELS[question.level]})`}</h2>
          <p className="question-text">{question.question}</p>
          <ul className="options">
            {question.options.map((option, i) => {
              const isCorrect = i === question.answer;
              return (
                <li key={i} className={isCorrect ? 'option correct' : 'option'}>
                  {`${LETTERS[i]}. ${option}`}
                  {isCorrect ? ' (Đáp án đúng)' : ''}
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p>Không tìm thấy câu hỏi</p>
      )}
      <button type="button" onClick={() => navigate(-1)}>
        Quay lại
      </button>
    </div>
  );
};

export default QuestionDetail;