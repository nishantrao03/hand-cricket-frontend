import React from 'react';
import styles from './score_board.module.css';

const ScoreBoard = ({ scoreboard, playerId, player1Id, player2Id, isUserBatting }) => {
  const isPlayer1 = playerId === player1Id;
  
  const myData = isPlayer1 ? scoreboard.player1 : scoreboard.player2;
  const oppData = isPlayer1 ? scoreboard.player2 : scoreboard.player1;

  const calculateOvers = (balls) => {
    const o = Math.floor(balls / 6);
    const b = balls % 6;
    return `${o}.${b}`;
  };

  return (
    <div className={styles.boardContainer}>
      <div className={`${styles.playerCard} ${isUserBatting ? styles.activeCard : ''}`}>
        <h3 className={styles.playerName}>YOU</h3>
        <div className={styles.scoreRow}>
          <span className={styles.runs}>{myData.score}</span>
          <span className={styles.wickets}>/{myData.wickets}</span>
        </div>
        <div className={styles.overs}>Overs: {calculateOvers(myData.balls)}</div>
      </div>

      <div className={styles.vsDivider}>VS</div>

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