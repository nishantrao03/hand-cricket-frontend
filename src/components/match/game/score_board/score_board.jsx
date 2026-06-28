import React from 'react';
import styles from './score_board.module.css';

const ScoreBoard = ({ scoreboard, playerId, battingFirstPlayerId, isUserBatting }) => {
  // Logic: If I am the one who batted first, my data is in innings1.
  const amIBattingFirst = playerId === battingFirstPlayerId;
  
  const myData = amIBattingFirst ? scoreboard.innings1 : scoreboard.innings2;
  const oppData = amIBattingFirst ? scoreboard.innings2 : scoreboard.innings1;

  const calculateOvers = (balls) => {
    const o = Math.floor(balls / 6);
    const b = balls % 6;
    return `${o}.${b}`;
  };

  return (
    <div className={styles.boardContainer}>
      {/* "YOU" Card */}
      <div className={`${styles.playerCard} ${isUserBatting ? styles.activeCard : ''}`}>
        <h3 className={styles.playerName}>YOU</h3>
        <div className={styles.scoreRow}>
          <span className={styles.runs}>{myData.score}</span>
          <span className={styles.wickets}>/{myData.wickets}</span>
        </div>
        <div className={styles.overs}>Overs: {calculateOvers(myData.balls)}</div>
      </div>

      <div className={styles.vsDivider}>VS</div>

      {/* "OPPONENT" Card */}
      <div className={`${styles.playerCard} ${!isUserBatting ? styles.activeCard : ''}`}>
        <h3 className={styles.playerName}>OPPONENT</h3>
        <div className={styles.scoreRow}>
          <span className={styles.runs}>{oppData.score}</span>
          <span className={styles.wickets}>/{oppData.wickets}</span>
        </div>
        <div className={styles.overs}>Overs: {calculateOvers(oppData.balls)}</div>
      </div>
    </div>
  );
};

export default ScoreBoard;