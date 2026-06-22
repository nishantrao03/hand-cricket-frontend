import React from 'react';
import styles from './waiting_for_choice.module.css';

const WaitingForChoice = () => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <div className={styles.spinner}></div>
      </div>
      <h1 className={styles.title}>Opponent Won Toss</h1>
      <p className={styles.subtitle}>
        Waiting for the opponent to decide whether to bat or bowl first...
      </p>
    </div>
  );
};

export default WaitingForChoice;