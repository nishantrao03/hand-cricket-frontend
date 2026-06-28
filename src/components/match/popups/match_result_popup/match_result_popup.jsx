import React from 'react';
import styles from './match_result_popup.module.css';

const MatchResultPopup = ({ matchResult, scoreboard, playerId, onAddFriend, onReturnHome }) => {
  const isWinner = matchResult?.winnerId === playerId;
  const isDraw = matchResult?.winnerId === null || matchResult?.winnerId === "DRAW";
  
  let headerText = "Match Ended";
  let headerColorStyle = styles.drawHeader;

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
          {/* Innings 1 Score Card */}
          <div className={styles.scoreCard}>
            <span className={styles.playerLabel}>Innings 1</span>
            <div className={styles.scoreRow}>
              <span className={styles.runs}>{scoreboard.innings1.score}</span>
              <span className={styles.wickets}>/{scoreboard.innings1.wickets}</span>
            </div>
            <span className={styles.oversText}>Balls: {scoreboard.innings1.balls}</span>
          </div>

          <div className={styles.vsDivider}>-</div>

          {/* Innings 2 Score Card */}
          <div className={styles.scoreCard}>
            <span className={styles.playerLabel}>Innings 2</span>
            <div className={styles.scoreRow}>
              <span className={styles.runs}>{scoreboard.innings2.score}</span>
              <span className={styles.wickets}>/{scoreboard.innings2.wickets}</span>
            </div>
            <span className={styles.oversText}>Balls: {scoreboard.innings2.balls}</span>
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