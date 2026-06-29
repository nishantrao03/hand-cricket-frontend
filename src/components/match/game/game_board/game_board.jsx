import React from 'react';
import styles from './game_board.module.css';

import ScoreBoard from '../score_board/score_board';
import MatchInfo from '../match_info/match_info';
import NumberSelector from '../number_selector/number_selector';
import WaitingOverlay from '../waiting_overlay/waiting_overlay';
import LeaveMatchButton from '../leave_match_button/leave_match_button';
import { useMatch } from '../../../../context/MatchContext';

const GameBoard = ({ onNumberSelect, onLeave }) => {
  const {
    playerId,
    playerUserNameMap,
    battingFirstPlayerId,
    innings,
    target,
    overs,
    scoreboard,
    lastBall,
    selectedNumber
  } = useMatch();

  console.log(selectedNumber);

  /* Determine batting status */
  const isUserBattingFirst = playerId === battingFirstPlayerId;
  const isUserBatting = innings === 1 ? isUserBattingFirst : !isUserBattingFirst;

  return (
    <div className={styles.boardWrapper}>
      <div className={styles.headerArea}>
        <div className={styles.spacer}></div>
        <h2 className={styles.boardTitle}>Hand Cricket Pitch</h2>
        <LeaveMatchButton onLeave={onLeave} />
      </div>

      <div className={styles.playArea}>
        <WaitingOverlay active={selectedNumber !== null} />

        <MatchInfo
          innings={innings}
          target={target}
          isUserBatting={isUserBatting}
          overs={overs}
          lastBall={lastBall}
          playerId={playerId}
          playerUserNameMap={playerUserNameMap}
        />

        <ScoreBoard
          scoreboard={scoreboard}
          battingFirstPlayerId={battingFirstPlayerId}
          innings={innings}
          playerUserNameMap={playerUserNameMap}
        />

        <NumberSelector
          onSelect={onNumberSelect}
          disabled={selectedNumber !== null}
          isUserBatting={isUserBatting}
        />
      </div>
    </div>
  );
};

export default GameBoard;