import React from 'react';
import styles from './button_home_page.module.css';

const ButtonHomePage = ({ label, onClick }) => {
  return (
    <button className={styles.gameButton} onClick={onClick}>
      {/* Sleek edge indicator that activates on hover */}
      <div className={styles.accentLine}></div>
      
      {/* Button content positioned above masks */}
      <span className={styles.buttonText}>{label}</span>
      
      {/* Radial lighting effect that tracks cursor focus */}
      <div className={styles.glowEffect}></div>
    </button>
  );
};

export default ButtonHomePage;