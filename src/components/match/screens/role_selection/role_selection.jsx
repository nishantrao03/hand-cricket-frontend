import React from 'react';
import styles from './role_selection.module.css';

const RoleSelection = ({ onChooseBat, onChooseBowl }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <svg viewBox="0 0 24 24" className={styles.statusIcon}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className={styles.title}>You Won the Toss!</h1>
      <p className={styles.subtitle}>
        The coin landed in your favor. What would you like to do first?
      </p>
      <div className={styles.buttonContainer}>
        <button className={`${styles.actionButton} ${styles.batButton}`} onClick={onChooseBat}>
          BAT
        </button>
        <button className={`${styles.actionButton} ${styles.bowlButton}`} onClick={onChooseBowl}>
          BOWL
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;