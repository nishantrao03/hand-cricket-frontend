import React from 'react';
import styles from './match_details.module.css';

const MatchDetails = ({ match, onClose }) => {
    // Utility function to calculate the specific margin of victory
    const getMatchResultText = () => {
        if (match.status !== "COMPLETED") return "Match is not completed";
        if (!match.winner) return "Match Tied/Drawn";

        const isWinnerPlayer1 = match.winnerId === match.player1Id;
        const winnerUsername = match.winner.username;
        const winnerBattedFirst = match.battingFirstPlayerId === match.winnerId;

        if (winnerBattedFirst) {
            // Winner batted first: Won by runs
            const runDiff = Math.abs(match.player1Score - match.player2Score);
            return `${winnerUsername} won by ${runDiff} runs`;
        } else {
            // Winner batted second: Won by wickets
            const winnerWicketsLost = isWinnerPlayer1 ? match.player1WicketsLost : match.player2WicketsLost;
            const wicketsRemaining = match.wickets - winnerWicketsLost;
            return `${winnerUsername} won by ${wicketsRemaining} wickets`;
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            {/* Prevent clicking inside the modal from closing it */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2 className={styles.title}>Match Details</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </header>

                <div className={styles.content}>
                    <div className={styles.matchup}>
                        <span>{match.player1.username}</span>
                        <span className={styles.vs}>VS</span>
                        <span>{match.player2.username}</span>
                    </div>

                    <div className={styles.resultBox}>
                        <p className={styles.resultText}>{getMatchResultText()}</p>
                    </div>

                    <div className={styles.statsContainer}>
                        <div className={styles.statGroup}>
                            <h3 className={styles.statHeader}>Format</h3>
                            <p className={styles.statValue}>{match.overs} Overs / {match.wickets} Wickets</p>
                        </div>

                        <div className={styles.divider}></div>

                        <div className={styles.inningData}>
                            <div className={styles.playerStat}>
                                <span className={styles.playerName}>
                                    {match.player1.username} 
                                    {match.battingFirstPlayerId === match.player1Id && <span className={styles.battingFirstBadge}>(Bat First)</span>}
                                </span>
                                <span className={styles.score}>{match.player1Score} / {match.player1WicketsLost}</span>
                            </div>

                            <div className={styles.playerStat}>
                                <span className={styles.playerName}>
                                    {match.player2.username}
                                    {match.battingFirstPlayerId === match.player2Id && <span className={styles.battingFirstBadge}>(Bat First)</span>}
                                </span>
                                <span className={styles.score}>{match.player2Score} / {match.player2WicketsLost}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchDetails;