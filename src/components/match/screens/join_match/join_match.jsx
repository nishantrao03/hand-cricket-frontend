import React from 'react';
import styles from './join_match.module.css';

const JoinMatch = ({ onJoin }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <svg viewBox="0 0 24 24" className={styles.statusIcon} style={{ stroke: '#64ffda' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h1 className={styles.title}>Match Invitation</h1>
      <p className={styles.subtitle}>
        You have been invited to a private match. Step onto the digital pitch and test your luck.
      </p>
      <button className={styles.primaryButton} onClick={onJoin}>
        Join Match
      </button>
    </div>
  );
};

export default JoinMatch;