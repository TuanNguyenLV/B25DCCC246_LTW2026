import { PRIZES, MILESTONES, formatMoney } from '../data';

const MoneyLadder = ({ current }) => {
  const rows = PRIZES.map((prize, i) => ({ prize, number: i + 1 })).reverse();
  return (
    <ul className="ladder">
      {rows.map(({ prize, number }) => {
        const classes = [
          'ladder-row',
          number === current ? 'active' : '',
          MILESTONES.includes(number) ? 'milestone' : '',
        ].join(' ');
        return (
          <li key={number} className={classes}>
            {`${number}. ${formatMoney(prize)}`}
          </li>
        );
      })}
    </ul>
  );
};

export default MoneyLadder;