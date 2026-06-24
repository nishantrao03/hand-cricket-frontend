import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './match_page.module.css';
import { io } from "socket.io-client";

/* Match components */
import InvalidMatch from '../../components/match/screens/invalid_match/invalid_match';
import AlreadyPlayingMatch from '../../components/match/screens/already_playing_match/already_playing_match';
import JoinMatch from '../../components/match/screens/join_match/join_match';
import WaitingForOpponent from '../../components/match/screens/waiting_for_opponent/waiting_for_opponent';
import SimulatingToss from '../../components/match/screens/simulating_toss/simulating_toss.jsx';
import TossResult from '../../components/match/screens/toss_result/toss_result';
import RoleSelection from '../../components/match/screens/role_selection/role_selection';
import WaitingForChoice from '../../components/match/screens/waiting_for_choice/waiting_for_choice';

import GameBoard from '../../components/match/game/game_board/game_board';
import ScoreBoard from '../../components/match/game/score_board/score_board';
import MatchInfo from '../../components/match/game/match_info/match_info';
import NumberSelector from '../../components/match/game/number_selector/number_selector';
import WaitingOverlay from '../../components/match/game/waiting_overlay/waiting_overlay';
import LeaveMatchButton from '../../components/match/game/leave_match_button/leave_match_button';

import InningsEndPopup from '../../components/match/popups/innings_end_popup/innings_end_popup';
import MatchResultPopup from '../../components/match/popups/match_result_popup/match_result_popup';
import MatchAbandonedPopup from '../../components/match/popups/match_abandoned_popup/match_abandoned_popup';
import { useMatch } from '../../context/MatchContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

import { fetchWithAuth } from '../../utils/fetchWithAuth.js';

import { createAuthenticatedSocket } from "../../utils/socketWithAuth";

console.log(useMatch);

const MatchPage = () => {
  const { matchId } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  //const [overs, setOvers] = useState("");

  const {
    phase,
    setPhase,

    isLoading: contextIsLoading,
    setIsLoading: contextSetIsLoading,

    matchId: contextMatchId,
    setMatchId: contextSetMatchId,

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

} = useMatch();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!matchId) {
      setPhase("INVALID_MATCH");
      return;
    }

    const fetchMatchData = async () => {
      try {
        const response = await fetchWithAuth(`${BACKEND_URL}/api/fetch-match-invitation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: matchId })
        });
        const data = await response.json();
        console.log("Fetched Match Invitation Data:", data);

        if (data.success && data.data) {
            setOvers(data.data.overs);
            setWickets(data.data.wickets);
            console.log(overs);
            console.log(wickets);
          setPhase("LOADING");
        } else {
          setPhase("INVALID_MATCH");
        }
      } catch (error) {
        console.error("Error fetching match invitation data:", error);
        setPhase("INVALID_MATCH");
      }
    };

    fetchMatchData();
  }, [matchId, BACKEND_URL, setPhase]);

  const handleMatchReady = (
    payload
) => {

    setPlayer1Id(
        payload.player1Id
    );

    setPlayer2Id(
        payload.player2Id
    );

    setPhase(
        "TOSS"
    );

    console.log(
        "Match Ready:",
        payload
    );
};

const handleTossResult = (
    payload
) => {

    setTossWinnerId(
        payload.tossWinnerId
    );

    if (
        payload.tossWinnerId ===
        userId
    ) {

        setPhase(
            "ROLE_SELECTION"
        );

    } else {

        setPhase(
            "WAITING_FOR_CHOICE"
        );
    }

    console.log(
        "Toss Result:",
        payload
    );
};

const handleChooseBat = () => {

    if (!socket) {
        return;
    }

    socket.emit(
        "choose-bat-bowl",
        JSON.stringify({

            matchId,

            playerId,

            choice: "BAT"
        })
    );
};

const handleChooseBowl = () => {

    if (!socket) {
        return;
    }

    socket.emit(
        "choose-bat-bowl",
        JSON.stringify({

            matchId,

            playerId,

            choice: "BOWL"
        })
    );
};

const handleRoleSelected = (
    payload
) => {

    setBattingFirstPlayerId(
        payload.battingFirstPlayerId
    );

    setInnings(
        payload.innings
    );

    setPhase(
        "TOSS_RESULT"
    );

    console.log(
        "Role Selected:",
        payload
    );
};

const handleStartMatch = () => {

    setPhase(
        "PLAYING"
    );
};

const handleNumberSelect = (
    number
) => {

    if (!socket) {
        return;
    }

    setSelectedNumber(
        number
    );

    socket.emit(
        "submit-move",
        JSON.stringify({

            matchId,

            playerId,

            number
        })
    );
};

const handleMoveReceived = (
    payload
) => {

    console.log(
        "Move Received:",
        payload
    );

    /*
    UI Change:

    If this player has already submitted
    their move and is waiting for the
    opponent's move, show:

    "Waiting for opponent move..."

    This is purely a UI change.
    No MatchContext state needs to
    be updated right now.
    */
};

const handleBallResult = (
    payload
) => {

    console.log(
        "Ball Result:",
        payload
    );

    setSelectedNumber(
        null
    );

    const ballData =

        payload.ballResult ||
        payload;

    setLastBall(
        ballData
    );

    setBallHistory(
        (prev) => [
            ...prev,
            ballData
        ]
    );

    setScoreboard(
        (prev) => {

            console.log(player1Id);
            if (
                ballData.batterId ===
                player1Id
            ) {

                return {

                    ...prev,

                    player1: {

                        ...prev.player1,

                        score:
                            ballData.score,

                        wickets:
                            ballData.wickets,

                        balls:
                            ballData.balls
                    }
                };
            }

            return {

                ...prev,

                player2: {

                    ...prev.player2,

                    score:
                        ballData.score,

                    wickets:
                        ballData.wickets,

                    balls:
                        ballData.balls
                }
            };
        }
    );

    /*
        MATCH ENDED
    */

    if (
        payload.matchResult
    ) {

        setMatchResult(
            payload.matchResult
        );

        setPhase(
            "MATCH_ENDED"
        );

        return;
    }

    /*
        INNINGS ENDED
    */

    if (
        payload.inningsResult
    ) {

        setTarget(
            payload.inningsResult.target
        );

        setInnings(
            2
        );
        console.log(innings);

        setPhase(
            "INNINGS_BREAK"
        );

        return;
    }

    /*
        NORMAL BALL
    */

    setPhase(
        "PLAYING"
    );
};

const handleLeaveMatch = () => {

    if (
        socket
    ) {

        setPhase(
            "MATCH_ABANDONED"
        );

        socket.disconnect();

        setSocket(
            null
        );
    }

    navigate(
        "/home"
    );
};

// const handleMatchEnded = (
//     payload
// ) => {

//     setEndReason(
//         payload.reason
//     );

//     setPhase(
//         "MATCH_ABANDONED"
//     );
// };

const handleJoinMatchSuccess = (
    payload
) => {

    console.log(
        "Join Match Success:",
        payload
    );

    /*
        Player has successfully
        joined the room.

        Waiting for second player
        to join.
    */

    setPhase(
        "WAITING"
    );
};

const handleStartSecondInnings = () => {

    setPhase(
        "PLAYING"
    );
};

    const handleJoinMatch = () => {

    setPlayerId(userId);

    const newSocket = createAuthenticatedSocket(BACKEND_URL);

    newSocket.on(
        "match-ready",
        handleMatchReady
    );

    newSocket.on(
    "join-match-success",
    handleJoinMatchSuccess
);

    newSocket.on(
    "toss-result",
    handleTossResult
);

    newSocket.on(
    "role-selected",
    handleRoleSelected
);

    newSocket.on(
    "move-received",
    handleMoveReceived
);

    newSocket.on(
    "ball-result",
    handleBallResult
);

//     newSocket.on(
//     "match-ended",
//     handleMatchEnded
// );

    newSocket.on(
    "connect_error",
    (err) => {

        console.error(
            "Socket Error:",
            err
        );
    }
);

    newSocket.on(
        "connect",
        () => {

            console.log(
                "Socket Connected:",
                newSocket.id
            );

            setSocket(
                newSocket
            );

            // setPhase(
            //     "WAITING"
            // );

            newSocket.emit(
                "join-match",
                JSON.stringify({

                    matchId,

                    playerId: userId,

                    overs: overs,

                    wickets: wickets
                })
            );
        }
    );
};

  const handleReturnHome = () => {
    navigate('/home');
  };

  return (
    <div className={styles.container}>
      {!phase ? (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Inspecting Pitch...</p>
        </div>
      ) : phase === "INVALID_MATCH" || phase === "INVALID" ? (
        <InvalidMatch onReturnHome={handleReturnHome} />
      ) : phase === "LOADING" ? (
        <JoinMatch onJoin={handleJoinMatch} />
      ) : phase === "WAITING" ? (
        <WaitingForOpponent onLeave={handleLeaveMatch} />
      ) : phase === "TOSS" ? (
        <SimulatingToss />
      ) : phase === "ROLE_SELECTION" ? (
        <RoleSelection onChooseBat={handleChooseBat} onChooseBowl={handleChooseBowl} />
      ) : phase === "WAITING_FOR_CHOICE" ? (
        <WaitingForChoice />
      ) : phase === "TOSS_RESULT" ? (
        <TossResult 
          tossWinnerId={tossWinnerId} 
          playerId={playerId} 
          battingFirstPlayerId={battingFirstPlayerId} 
          onContinue={handleStartMatch} 
        />
        ) : phase === "PLAYING" ? (
        <GameBoard 
          onNumberSelect={handleNumberSelect} 
          onLeave={handleLeaveMatch} 
        />
      ) : phase === "INNINGS_BREAK" ? (
        <InningsEndPopup 
          target={target} 
          onContinue={handleStartSecondInnings} 
        />
      ) : phase === "MATCH_ENDED" ? (
        <MatchResultPopup 
          matchResult={matchResult} 
          scoreboard={scoreboard} 
          playerId={playerId} 
          onAddFriend={() => {}} 
          onReturnHome={handleLeaveMatch} 
        />
      ) : phase === "MATCH_ABANDONED" ? (
        <MatchAbandonedPopup 
          endReason={endReason} 
          onAddFriend={() => {}} 
          onReturnHome={handleLeaveMatch} 
        />
      ) : null}
    </div>
  );
};

export default MatchPage;