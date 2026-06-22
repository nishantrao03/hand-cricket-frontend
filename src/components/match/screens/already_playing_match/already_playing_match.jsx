import React from 'react';
import styles from './already_playing_match.module.css';

const AlreadyPlayingMatch = ({ onReturnHome }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <svg viewBox="0 0 24 24" className={styles.statusIcon} style={{ stroke: '#f59e0b' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className={styles.title}>Action Blocked</h1>
      <p className={styles.subtitle}>
        You are currently participating in another active match. Please conclude or leave it before joining a new session.
      </p>
      <button className={styles.secondaryButton} onClick={onReturnHome}>
        Return to Lobby
      </button>
    </div>
  );
};

export default AlreadyPlayingMatch;