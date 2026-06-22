import React from 'react';
import styles from './leave_match_button.module.css';

const LeaveMatchButton = ({ onLeave }) => {
  return (
    <button className={styles.leaveBtn} onClick={onLeave} title="Abandon Match">
      <svg viewBox="0 0 24 24" className={styles.icon}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    </button>
  );
};

export default LeaveMatchButton;