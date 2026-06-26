import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './match_rules.module.css';

const MatchRules = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <div className={styles.contentShell}>
                
                <div className={styles.navBar}>
                    <button className={styles.backButton} onClick={() => navigate('/home')}>
                        &larr; Back to Home
                    </button>
                </div>

                <header className={styles.headerBlock}>
                    <p className={styles.eyebrow}>Gameplay Guide</p>
                    <h1 className={styles.title}>MATCH RULES</h1>
                    <p className={styles.subtitle}>Master the mechanics of Hand Cricket.</p>
                </header>

                <main className={styles.rulesContainer}>
                    
                    {/* Section 1: The Basics */}
                    <section className={styles.ruleCard}>
                        <h2 className={styles.sectionTitle}>1. Match Format & Objective</h2>
                        <p className={styles.ruleText}>
                            Hand Cricket is a strategic two-player game. The match begins with a coin toss, where the winner chooses to bat or bowl first. The game is played across two innings; after the first innings, the players swap roles. The primary objective is to score more runs than the opponent before running out of balls or wickets.
                        </p>
                        <p className={styles.ruleText}>
                            Before a match starts, players configure the match length by setting the limit for <strong>Overs (5 to 20)</strong> and <strong>Wickets (1 to 30)</strong> per innings. Each over consists of exactly 6 balls.
                        </p>
                    </section>

                    {/* Section 2: Core Gameplay & Scoring */}
                    <section className={styles.ruleCard}>
                        <h2 className={styles.sectionTitle}>2. Gameplay & Scoring Mechanics</h2>
                        <p className={styles.ruleText}>
                            During each delivery, both players make simultaneous numerical selections:
                        </p>
                        <ul className={styles.ruleList}>
                            <li><strong>The Bowler</strong> selects a number from <strong>1 to 6</strong>.</li>
                            <li><strong>The Batter</strong> selects a number from <strong>0 to 6</strong>.</li>
                        </ul>
                        <div className={styles.highlightBox}>
                            <h3 className={styles.subHeading}>Calculating Runs</h3>
                            <p className={styles.ruleText}>
                                If the numbers chosen by the batter and bowler are different, runs are scored based on the absolute mathematical difference between the two numbers, subject to the following special conditions:
                            </p>
                            <ul className={styles.ruleList}>
                                <li><strong>The Defensive Block (0):</strong> If the batter chooses 0, no runs are scored, and no wickets can be lost regardless of the bowler's choice.</li>
                                <li><strong>The Boundary Rule (6 Runs):</strong> If the absolute difference between the numbers is exactly 5 (i.e., Batter picks 1 and Bowler picks 6, or vice versa), the batter is awarded <strong>6 runs</strong> instead of 5. A score of 5 runs is never awarded in this game.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3: Wickets & Dismissals */}
                    <section className={styles.ruleCard}>
                        <h2 className={styles.sectionTitle}>3. Wickets & Dismissals</h2>
                        <p className={styles.ruleText}>
                            A dismissal occurs when the batter and the bowler choose the exact <strong>same number</strong>. However, the severity of the dismissal varies depending on the number that caused the collision.
                        </p>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Matching Number Chosen</th>
                                    <th>Wickets Lost</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1 or 6</td>
                                    <td className={styles.dangerText}>3 Wickets</td>
                                </tr>
                                <tr>
                                    <td>2 or 5</td>
                                    <td className={styles.warningText}>2 Wickets</td>
                                </tr>
                                <tr>
                                    <td>3 or 4</td>
                                    <td className={styles.safeText}>1 Wicket</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* Section 4: Penalties */}
                    <section className={styles.ruleCard}>
                        <h2 className={styles.sectionTitle}>4. The Penalty Rule</h2>
                        <p className={styles.ruleText}>
                            To prevent predictable patterns and stalling, there is a strict limit on repetitive actions. A player is penalized if they choose the <strong>exact same number for more than 2 consecutive deliveries</strong> (i.e., making the same choice 3 times in a row).
                        </p>
                        <ul className={styles.ruleList}>
                            <li><strong>Batter Penalty:</strong> If the batter violates this rule, a 10-run penalty is deducted directly from their current score.</li>
                            <li><strong>Bowler Penalty:</strong> If the bowler violates this rule, a 10-run penalty is awarded to the opponent batter's score.</li>
                        </ul>
                    </section>

                </main>
                
                <footer className={styles.footerBlock}>
                    <p className={styles.footerText}>Good luck, and may the best strategist win.</p>
                </footer>

            </div>
        </div>
    );
};

export default MatchRules;