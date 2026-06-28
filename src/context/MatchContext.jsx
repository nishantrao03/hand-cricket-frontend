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
    innings1: {
      score: 0,
      wickets: 0,
      balls: 0
    },

    innings2: {
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

  console.log("Current Context State - Scoreboard:", scoreboard);

  const restoreMatchContext = (match) => {
    if (!match) return;

    setMatchId(match.matchId);
    setPlayer1Id(match.player1Id);
    setPlayer2Id(match.player2Id);
    setOvers(match.overs);
    setWickets(match.wickets);
    setPhase(match.phase);
    
    setTossWinnerId(match.tossWinnerId);
    setBattingFirstPlayerId(match.battingFirstPlayerId);
    
    setInnings(match.innings);
    setTarget(match.target);

    // Map backend innings1/innings2 to frontend player1/player2
    if (match.battingFirstPlayerId) {
      const isPlayer1BattingFirst = match.battingFirstPlayerId === match.player1Id;
      
      setScoreboard({
        innings1: {
          score: isPlayer1BattingFirst ? match.innings1.runs : match.innings2.runs,
          wickets: isPlayer1BattingFirst ? match.innings1.wickets : match.innings2.wickets,
          balls: isPlayer1BattingFirst ? match.innings1.balls : match.innings2.balls,
        },
        innings2: {
          score: isPlayer1BattingFirst ? match.innings2.runs : match.innings1.runs,
          wickets: isPlayer1BattingFirst ? match.innings2.wickets : match.innings1.wickets,
          balls: isPlayer1BattingFirst ? match.innings2.balls : match.innings1.balls,
        },
      });
    }

    if (match.resultHistory && match.resultHistory.length > 0) {
      
      let currentInnings = 1;
      let runningScore = 0;
      let runningWickets = 0;
      let runningBalls = 0;

      const mappedHistory = match.resultHistory.map((ball) => {
        // 1. Reset cumulative stats if innings switches from 1 to 2
        if (ball.innings !== currentInnings) {
          currentInnings = ball.innings;
          runningScore = 0;
          runningWickets = 0;
          runningBalls = 0;
        }

        // 2. Accumulate totals
        runningBalls += 1;
        runningWickets += ball.wicketsLost;
        runningScore += ball.runs;
        
        if (ball.penaltyApplied === "BATTER") runningScore = Math.max(0, runningScore - 10);
        if (ball.penaltyApplied === "BOWLER") runningScore += 10;

        // 3. Figure out whose ID is currently batting
        const isPlayer1BattingFirst = match.battingFirstPlayerId === match.player1Id;
        const currentBatterId = ball.innings === 1 
          ? match.battingFirstPlayerId 
          : (isPlayer1BattingFirst ? match.player2Id : match.player1Id);

        // 4. Return the exact format the frontend expects
        return {
          batterId: currentBatterId,
          runs: ball.runs,
          wicketsLost: ball.wicketsLost,
          score: runningScore,
          wickets: runningWickets,
          balls: runningBalls,
          penaltyApplied: ball.penaltyApplied
        };
      });

      setBallHistory(mappedHistory);
      setLastBall(mappedHistory[mappedHistory.length - 1]);
    }

    // Reset pending moves to ensure clean local UI state
    setSelectedNumber(null);
  };

  const value = {

    phase,
    setPhase,

    isLoading,
    setIsLoading, // NR

    matchId,
    setMatchId,

    playerId,
    setPlayerId, // NR

    player1Id,
    setPlayer1Id,

    player2Id,
    setPlayer2Id,

    socket,
    setSocket, // NR

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
    setScoreboard, // TBB

    ballHistory,
    setBallHistory, // TBB

    lastBall,
    setLastBall,

    selectedNumber,
    setSelectedNumber,

    matchResult,
    setMatchResult,

    endReason,
    setEndReason,

    restoreMatchContext
  };

  

  return (
    <MatchContext.Provider value={value}>
      {children}
    </MatchContext.Provider>
  );
}