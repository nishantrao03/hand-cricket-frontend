import React from 'react';
import styles from './toss_result.module.css';

const TossResult = ({ tossWinnerId, playerId, battingFirstPlayerId, onContinue }) => {
  const isWinner = tossWinnerId === playerId;
  const choseToBat = tossWinnerId === battingFirstPlayerId;
  
  const winnerText = isWinner ? "You" : "Opponent";
  const choiceText = choseToBat ? "BAT" : "BOWL";

  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <svg viewBox="0 0 24 24" className={styles.statusIcon}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      </div>
      <h1 className={styles.title}>Toss Decided</h1>
      <p className={styles.subtitle}>
        <span className={styles.highlight}>{winnerText}</span> won the toss and elected to <span className={styles.highlight}>{choiceText}</span> first.
      </p>
      <button className={styles.primaryButton} onClick={onContinue}>
        Continue to Match
      </button>
    </div>
  );
};

export default TossResult;