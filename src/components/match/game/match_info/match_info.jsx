import React from 'react';
import styles from './match_info.module.css';

const MatchInfo = ({
  innings,
  target,
  isUserBatting,
  overs,
  lastBall,
  playerId,
  playerUserNameMap
}) => {

  const playerUserName = playerUserNameMap[playerId];

  const opponentUserName = Object.entries(playerUserNameMap)
    .find(([id]) => id !== playerId)?.[1];

  const batterUserName = isUserBatting
    ? playerUserName
    : opponentUserName;

  const bowlerUserName = isUserBatting
    ? opponentUserName
    : playerUserName;

  console.log("Last ball");
  console.log(lastBall);

  return (
    <div className={styles.infoContainer}>
      <div className={styles.topRow}>
        <div className={styles.badge}>Innings {innings}</div>
        <div className={styles.badge}>Max Overs: {overs}</div>
        {target && (
          <div className={`${styles.badge} ${styles.targetBadge}`}>
            Target: {target}
          </div>
        )}
      </div>

      <div className={styles.roleHeader}>
        {batterUserName} (BAT) vs {bowlerUserName} (BOWL)
      </div>

      {lastBall && (
        <div className={styles.lastBallInfo}>
          Last Ball{/* Last Ball: Batter [{lastBall.batterNumber}] vs Bowler [{lastBall.bowlerNumber}] */}
          <span className={styles.resultArrow}> ➔ </span>
          
          {/* Display runs or wickets based on the ball outcome */}
          {lastBall.wicketsLost > 0 ? (
            <span className={styles.wicketText}>{lastBall.wicketsLost} Wicket</span>
          ) : (
            <span className={styles.runText}>+{lastBall.runs || 0} Runs</span>
          )}

          {/* Conditionally display penalty if one was applied */}
          {lastBall.penaltyApplied && (
            <span className={styles.penaltyText}> | Penalty: {lastBall.penaltyApplied}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchInfo;