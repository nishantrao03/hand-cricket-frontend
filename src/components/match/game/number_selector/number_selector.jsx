import React from 'react';
import styles from './number_selector.module.css';

const NumberSelector = ({ onSelect, disabled, isUserBatting }) => {
  /* Batters can select 0-6, Bowlers can only select 1-6 */
  const numbers = isUserBatting ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6];

  return (
    <div className={styles.selectorWrapper}>
      <h4 className={styles.instruction}>Select your move</h4>
      <div className={styles.grid}>
        {numbers.map((num) => (
          <button
            key={`num-${num}`}
            className={styles.numBtn}
            onClick={() => onSelect(num)}
            disabled={disabled}
          >
            {num}
          </button>
        ))}
      </div>
      <p className={styles.rulesHint}>
        * Matching numbers = Wicket. Diff of 5 = 6 Runs. 3x repeated = 10 run penalty.
      </p>
    </div>
  );
};

export default NumberSelector;