import React from 'react';
import styles from './match_result_popup.module.css';

const MatchResultPopup = ({ matchResult, scoreboard, playerId, onAddFriend, onReturnHome }) => {
  const isWinner = matchResult?.winnerId === playerId;
  const isDraw = matchResult?.winnerId === null || matchResult?.winnerId === "DRAW";
  
  let headerText = "Match Ended";
  let headerColorStyle = styles.drawHeader;
  console.log(scoreboard);

  if (!isDraw) {
    headerText = isWinner ? "VICTORY" : "DEFEAT";
    headerColorStyle = isWinner ? styles.winHeader : styles.lossHeader;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h1 className={`${styles.title} ${headerColorStyle}`}>{headerText}</h1>
        
        {matchResult?.description && (
          <p className={styles.resultDescription}>{matchResult.description}</p>
        )}

        <div className={styles.scoreContainer}>
          <div className={styles.scoreCard}>
            <span className={styles.playerLabel}>Player 1</span>
            <div className={styles.scoreRow}>
              <span className={styles.runs}>{scoreboard.player1.score}</span>
              <span className={styles.wickets}>/{scoreboard.player1.wickets}</span>
            </div>
            <span className={styles.oversText}>Balls: {scoreboard.player1.balls}</span>
          </div>

          <div className={styles.vsDivider}>-</div>

          <div className={styles.scoreCard}>
            <span className={styles.playerLabel}>Player 2</span>
            <div className={styles.scoreRow}>
              <span className={styles.runs}>{scoreboard.player2.score}</span>
              <span className={styles.wickets}>/{scoreboard.player2.wickets}</span>
            </div>
            <span className={styles.oversText}>Balls: {scoreboard.player2.balls}</span>
          </div>
        </div>

        <div className={styles.actionFooter}>
          <button className={styles.secondaryButton} onClick={onAddFriend}>
            Add Friend
          </button>
          <button className={styles.primaryButton} onClick={onReturnHome}>
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchResultPopup;