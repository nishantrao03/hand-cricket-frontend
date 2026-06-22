import React from 'react';
import styles from './waiting_for_opponent.module.css';

const WaitingForOpponent = ({ onLeave }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <svg viewBox="0 0 24 24" className={styles.pulseIcon}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className={styles.title}>Waiting for Opponent</h1>
      <p className={styles.subtitle}>
        You have successfully joined the room. The match will automatically begin once the challenger connects.
      </p>
      
      <div className={styles.loadingBarContainer}>
        <div className={styles.loadingBar}></div>
      </div>

      <button className={styles.secondaryButton} onClick={onLeave}>
        Leave Match
      </button>
    </div>
  );
};

export default WaitingForOpponent;