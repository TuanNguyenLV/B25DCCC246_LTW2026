import { memo, useRef } from 'react';
import { RESULT_LABELS } from '../data';
import { getTeamName, getResult, isValidGoals } from '../utils';

const MatchRow = ({ match, onGoals, onRemove }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <tr
      style={
        getResult(match) === 'draw' ? { background: 'rgba(255, 193, 7, 0.25)' } : undefined
      }
    >
      <td>{match.round}</td>
      <td>{getTeamName(match.home)}</td>
      <td>
        <input
          type="number"
          min="0"
          max="20"
          value={match.homeGoals}
          aria-label={`Bàn thắng nhà ${getTeamName(match.home)} - ${getTeamName(match.away)}`}
          onChange={(e) => {
            const v = e.target.valueAsNumber;
            if (isValidGoals(v)) onGoals(match.id, v, match.awayGoals);
          }}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="20"
          value={match.awayGoals}
          aria-label={`Bàn thắng khách ${getTeamName(match.home)} - ${getTeamName(match.away)}`}
          onChange={(e) => {
            const v = e.target.valueAsNumber;
            if (isValidGoals(v)) onGoals(match.id, match.homeGoals, v);
          }}
        />
      </td>
      <td>{getTeamName(match.away)}</td>
      <td>{RESULT_LABELS[getResult(match)]}</td>
      <td>{renderCount.current}</td>
      <td>
        <button type="button" onClick={() => onRemove(match)}>
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default memo(MatchRow);