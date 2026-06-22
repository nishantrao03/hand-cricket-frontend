import React from 'react';
import styles from './match_info.module.css';

const MatchInfo = ({ innings, target, isUserBatting, overs, lastBall }) => {
  return (
    <div className={styles.infoContainer}>
      <div className={styles.topRow}>
        <div className={styles.badge}>Innings {innings}</div>
        <div className={styles.badge}>Max Overs: {overs}</div>
        {target && <div className={`${styles.badge} ${styles.targetBadge}`}>Target: {target}</div>}
      </div>
      
      <div className={styles.roleHeader}>
        You are currently <span className={isUserBatting ? styles.batText : styles.bowlText}>{isUserBatting ? "BATTING" : "BOWLING"}</span>
      </div>

      {lastBall && (
        <div className={styles.lastBallInfo}>
          Last Ball: Batter [{lastBall.batterNumber}] vs Bowler [{lastBall.bowlerNumber}] 
          <span className={styles.resultArrow}> ➔ </span> 
          {lastBall.wicketsLost > 0 ? (
            <span className={styles.wicketText}>WICKET!</span>
          ) : (
            <span className={styles.runText}>+{lastBall.score || 0} Runs</span>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchInfo;