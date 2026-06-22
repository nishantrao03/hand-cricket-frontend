import React from 'react';
import styles from './waiting_overlay.module.css';

const WaitingOverlay = ({ active }) => {
  if (!active) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Waiting for opponent's move...</p>
    </div>
  );
};

export default WaitingOverlay;