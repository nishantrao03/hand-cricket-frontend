import React from 'react';
import styles from './match_abandoned_popup.module.css';

const MatchAbandonedPopup = ({ endReason, onAddFriend, onReturnHome }) => {
  
  const getReasonText = () => {
    switch(endReason) {
      case 'PLAYER_DISCONNECTED':
        return "Your opponent has disconnected from the match.";
      case 'MOVE_TIMEOUT':
        return "The match timed out due to inactivity.";
      default:
        return "The match was terminated unexpectedly.";
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <svg viewBox="0 0 24 24" className={styles.icon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className={styles.title}>Match Abandoned</h2>
        <p className={styles.subtitle}>
          {getReasonText()}
        </p>
        
        <div className={styles.actionFooter}>
          <button className={styles.secondaryButton} onClick={onAddFriend}>
            Add Friend
          </button>
          <button className={styles.primaryButton} onClick={onReturnHome}>
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchAbandonedPopup;