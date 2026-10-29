import { LETTERS } from '../data';

const AudienceChart = ({ percents }) => (
  <div className="audience">
    <h3>Ý kiến khán giả</h3>
    {LETTERS.map((letter, i) => (
      <div key={letter} className="bar-track">
        <div className="bar" style={{ width: `${percents[i]}%` }}>
          {`${letter}: ${percents[i]}%`}
        </div>
      </div>
    ))}
  </div>
);

export default AudienceChart;