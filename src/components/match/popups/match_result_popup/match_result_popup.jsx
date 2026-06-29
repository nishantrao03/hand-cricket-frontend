import React from 'react';
import styles from './match_result_popup.module.css';

const MatchResultPopup = ({
  matchResult,
  scoreboard,
  playerId,
  onAddFriend,
  onReturnHome,
  battingFirstPlayerId,
  playerUserNameMap,
  wickets,
  overs
}) => {
  console.log({
    overs,
    wickets,
    innings1: scoreboard.innings1,
    innings2: scoreboard.innings2,
    winnerId: matchResult.winnerId,
    battingFirstPlayerId
});

  const isWinner = matchResult?.winnerId === playerId;
  const isDraw = matchResult?.winnerId === null || matchResult?.winnerId === "DRAW";

  let headerText = "MATCH DRAWN";
  let headerColorStyle = styles.drawHeader;
  let detailedResult = "Match Drawn";
  let detailedResultStyle = styles.drawResult;

  console.log(playerUserNameMap);
  const winnerUserName = playerUserNameMap[matchResult?.winnerId];

  const innings1UserName = playerUserNameMap[battingFirstPlayerId];

  const innings2UserName = Object.entries(playerUserNameMap)
    .find(([id]) => id !== battingFirstPlayerId)?.[1];

  if (!isDraw) {
    headerText = isWinner ? "VICTORY" : "DEFEAT";
    headerColorStyle = isWinner ? styles.winHeader : styles.lossHeader;
    detailedResultStyle = isWinner ? styles.winResult : styles.lossResult;

    const winnerBattedFirst = matchResult?.winnerId === battingFirstPlayerId;

    if (winnerBattedFirst) {
      const runDifference = Math.abs(scoreboard.innings1.score - scoreboard.innings2.score);
      detailedResult = `${winnerUserName} won by ${runDifference} runs`;
    } else {
      const wicketsLeft = wickets - scoreboard.innings2.wickets;
      const ballsLeft = (overs * 6) - scoreboard.innings2.balls;
      detailedResult = `${winnerUserName} won by ${wicketsLeft} wickets (${ballsLeft} balls left)`;
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h1 className={`${styles.title} ${headerColorStyle}`}>{headerText}</h1>

        <div className={`${styles.detailedResultBadge} ${detailedResultStyle}`}>
          {detailedResult}
        </div>

        {matchResult?.description && (
          <p className={styles.resultDescription}>{matchResult.description}</p>
        )}

        <div className={styles.scoreContainer}>
          <div className={styles.scoreCard}>
            <span className={styles.playerLabel}>{innings1UserName}</span>
            <div className={styles.scoreRow}>
              <span className={styles.runs}>{scoreboard.innings1.score}</span>
              <span className={styles.wickets}>/{scoreboard.innings1.wickets}</span>
            </div>
            <span className={styles.oversText}>Balls: {scoreboard.innings1.balls}</span>
          </div>

          <div className={styles.vsDivider}>-</div>

          <div className={styles.scoreCard}>
            <span className={styles.playerLabel}>{innings2UserName}</span>
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