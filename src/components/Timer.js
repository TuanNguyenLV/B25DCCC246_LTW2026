const Timer = ({ timeLeft }) => (
  <div className={timeLeft <= 10 ? 'timer danger' : 'timer'}>
    {`Còn ${timeLeft} giây`}
  </div>
);

export default Timer;