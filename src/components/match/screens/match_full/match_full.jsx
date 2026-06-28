import React from 'react';
import styles from './match_full.module.css';

const MatchFull = ({ onReturnHome }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <svg viewBox="0 0 24 24" className={styles.statusIcon} style={{ stroke: '#ff9f43' }}>
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
          />
        </svg>
      </div>
      <h1 className={styles.title}>Match Full</h1>
      <p className={styles.subtitle}>
        Both players have already joined this lobby. There are no available slots left.
      </p>
      <button className={styles.secondaryButton} onClick={onReturnHome}>
        Return to Lobby
      </button>
    </div>
  );
};

export default MatchFull;