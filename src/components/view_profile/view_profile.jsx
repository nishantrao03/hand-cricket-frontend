import React from 'react';
import styles from './view_profile.module.css'; // Assuming you map this to the same CSS structure as MatchDetails

const ViewProfile = ({ friend, onClose }) => {
    // If no friend is selected, don't render the overlay at all
    if (!friend) return null;

    // Aliasing friend to profile to seamlessly map to the existing UI variables
    const profile = friend;

    return (
        <div className={styles.overlay} onClick={onClose}>
            {/* Prevent clicking inside the modal from closing it */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2 className={styles.title}>Player Profile</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </header>

                <div className={styles.content}>
                    <>
                        <div className={styles.matchup}>
                            <span>{profile.username}</span>
                        </div>

                        {/* Bio Box */}
                        <div className={styles.resultBox}>
                            <p className={styles.resultText} style={{ fontWeight: "normal", fontSize: "0.95rem", color: "#c8d6e5" }}>
                                {profile.bio || "This user hasn't written a bio yet."}
                            </p>
                        </div>

                        <div className={styles.statsContainer}>
                            {/* Identity / Basic Info */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", textAlign: "center" }}>
                                <div>
                                    <h3 className={styles.statHeader}>Country</h3>
                                    <p className={styles.statValue}>{profile.country || "—"}</p>
                                </div>
                                <div>
                                    <h3 className={styles.statHeader}>Favorite Team</h3>
                                    <p className={styles.statValue}>{profile.favoriteTeam || "—"}</p>
                                </div>
                            </div>
                            
                            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                                <h3 className={styles.statHeader}>Discord</h3>
                                <p className={styles.statValue}>{profile.discordUsername || "—"}</p>
                            </div>

                            <div className={styles.divider}></div>

                            {/* Core Gameplay Stats */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", textAlign: "center" }}>
                                <div>
                                    <h3 className={styles.statHeader}>Matches</h3>
                                    <p className={styles.statValue}>{profile.matchesPlayed}</p>
                                </div>
                                <div>
                                    <h3 className={styles.statHeader}>Wins</h3>
                                    <p className={styles.statValue}>{profile.matchesWon}</p>
                                </div>
                                <div>
                                    <h3 className={styles.statHeader}>Win Rate</h3>
                                    <p className={styles.statValue}>
                                        {profile.matchesPlayed > 0 
                                            ? Math.round((profile.matchesWon / profile.matchesPlayed) * 100) 
                                            : 0}%
                                    </p>
                                </div>
                            </div>

                            <div className={styles.divider}></div>

                            {/* Advanced Cricket Stats */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", textAlign: "center" }}>
                                <div>
                                    <h3 className={styles.statHeader}>Total Runs</h3>
                                    <p className={styles.statValue} style={{ color: "#64ffda" }}>{profile.totalRunsScored}</p>
                                </div>
                                <div>
                                    <h3 className={styles.statHeader}>Runs Conceded</h3>
                                    <p className={styles.statValue} style={{ color: "#ff8f8f" }}>{profile.totalRunsConceded}</p>
                                </div>
                            </div>

                            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                                <h3 className={styles.statHeader}>Net Run Rate (NRR)</h3>
                                <p className={styles.statValue}>
                                    {profile.netRunRate > 0 ? "+" : ""}{(profile.netRunRate || 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </>
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;