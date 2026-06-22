import React from 'react';
import styles from './innings_end_popup.module.css';

const InningsEndPopup = ({ target, onContinue }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <svg viewBox="0 0 24 24" className={styles.icon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className={styles.title}>Innings Break</h2>
        <p className={styles.subtitle}>
          The first innings has concluded.
        </p>
        <div className={styles.targetBox}>
          <span className={styles.targetLabel}>Target to Win</span>
          <span className={styles.targetValue}>{target}</span>
        </div>
        <button className={styles.primaryButton} onClick={onContinue}>
          Start Second Innings
        </button>
      </div>
    </div>
  );
};

export default InningsEndPopup;