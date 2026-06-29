import React from 'react';
import styles from './score_board.module.css';

const ScoreBoard = ({
  scoreboard,
  battingFirstPlayerId,
  innings,
  playerUserNameMap
}) => {

  const innings1UserName = playerUserNameMap[battingFirstPlayerId];

  const innings2UserName = Object.entries(playerUserNameMap)
    .find(([id]) => id !== battingFirstPlayerId)?.[1];

  const calculateOvers = (balls) => {
    const o = Math.floor(balls / 6);
    const b = balls % 6;
    return `${o}.${b}`;
  };

  return (
    <div className={styles.boardContainer}>
      {/* Innings 1 */}
      <div className={`${styles.playerCard} ${innings === 1 ? styles.activeCard : ''}`}>
        <h3 className={styles.playerName}>{innings1UserName}</h3>

        <div className={styles.scoreRow}>
          <span className={styles.runs}>{scoreboard.innings1.score}</span>
          <span className={styles.wickets}>/{scoreboard.innings1.wickets}</span>
        </div>

        <div className={styles.overs}>
          Overs: {calculateOvers(scoreboard.innings1.balls)}
        </div>
      </div>

      <div className={styles.vsDivider}>VS</div>

      {/* Innings 2 */}
      <div className={`${styles.playerCard} ${innings === 2 ? styles.activeCard : ''}`}>
        <h3 className={styles.playerName}>{innings2UserName}</h3>

        <div className={styles.scoreRow}>
          <span className={styles.runs}>{scoreboard.innings2.score}</span>
          <span className={styles.wickets}>/{scoreboard.innings2.wickets}</span>
        </div>

        <div className={styles.overs}>
          Overs: {calculateOvers(scoreboard.innings2.balls)}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;