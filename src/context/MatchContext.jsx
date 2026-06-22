import React, {
  useContext,
  useState
} from "react";

const MatchContext = React.createContext();

export function useMatch() {
  return useContext(MatchContext);
}

export function MatchProvider({ children }) {

  /*
    MATCH FLOW

    LOADING
    INVALID_MATCH
    WAITING
    TOSS
    WAITING_FOR_CHOICE
    ROLE_SELECTION
    TOSS_RESULT
    PLAYING
    INNINGS_BREAK
    MATCH_ENDED
    MATCH_ABANDONED
  */

  const [phase, setPhase] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [matchId, setMatchId] =
    useState(null);

  const [playerId, setPlayerId] =
    useState(null);

  const [player1Id, setPlayer1Id] =
    useState(null);

  const [player2Id, setPlayer2Id] =
    useState(null);

  /*
    SOCKET
  */

  const [socket, setSocket] =
    useState(null);

  /*
    TOSS
  */

  const [tossWinnerId, setTossWinnerId] =
    useState(null);

  /*
    ROLE SELECTION
  */

  const [
    battingFirstPlayerId,
    setBattingFirstPlayerId
  ] = useState(null);

  /*
    MATCH CONFIG
  */

  const [overs, setOvers] =
    useState(null);

  const [wickets, setWickets] =
    useState(null);

  /*
    MATCH STATE
  */

  const [innings, setInnings] =
    useState(1);

  const [target, setTarget] =
    useState(null);

  /*
    SCOREBOARD
  */

  const [
    scoreboard,
    setScoreboard
  ] = useState({
    player1: {
      score: 0,
      wickets: 0,
      balls: 0
    },

    player2: {
      score: 0,
      wickets: 0,
      balls: 0
    }
  });

  /*
    BALL HISTORY
  */

  const [
    ballHistory,
    setBallHistory
  ] = useState([]);

  /*
    LAST BALL
  */

  const [
    lastBall,
    setLastBall
  ] = useState(null);

  /*
    USER INPUT
  */

  const [
    selectedNumber,
    setSelectedNumber
  ] = useState(null);

  /*
    MATCH RESULT
  */

  const [
    matchResult,
    setMatchResult
  ] = useState(null);

  /*
    MATCH END
  */

  const [
    endReason,
    setEndReason
  ] = useState(null);

  const value = {

    phase,
    setPhase,

    isLoading,
    setIsLoading,

    matchId,
    setMatchId,

    playerId,
    setPlayerId,

    player1Id,
    setPlayer1Id,

    player2Id,
    setPlayer2Id,

    socket,
    setSocket,

    tossWinnerId,
    setTossWinnerId,

    battingFirstPlayerId,
    setBattingFirstPlayerId,

    overs,
    setOvers,

    wickets,
    setWickets,

    innings,
    setInnings,

    target,
    setTarget,

    scoreboard,
    setScoreboard,

    ballHistory,
    setBallHistory,

    lastBall,
    setLastBall,

    selectedNumber,
    setSelectedNumber,

    matchResult,
    setMatchResult,

    endReason,
    setEndReason
  };

  return (
    <MatchContext.Provider value={value}>
      {children}
    </MatchContext.Provider>
  );
}