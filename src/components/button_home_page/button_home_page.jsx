import React from 'react';
import styles from './button_home_page.module.css';
import { useAuth } from "../../context/AuthContext.jsx";

const ButtonHomePage = ({ label, onClick }) => {

    const { userName } = useAuth();

console.log(userName);
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