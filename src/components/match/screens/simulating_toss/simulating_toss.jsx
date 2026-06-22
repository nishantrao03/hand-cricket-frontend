import React from 'react';
import styles from './simulating_toss.module.css';

const SimulatingToss = () => {
  return (
    <div className={styles.card}>
      <div className={styles.coinContainer}>
        <div className={styles.coin}>
          <div className={styles.coinInner}></div>
        </div>
      </div>
      <h1 className={styles.title}>Simulating Toss</h1>
      <p className={styles.subtitle}>
        The virtual coin is in the air. Preparing to determine who gets the first choice...
      </p>
    </div>
  );
};

export default SimulatingToss;