import React from 'react';
import styles from './landing_page.module.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      {/* Decorative Game Elements */}
      {/* <div className={styles.pitchDecoration}></div>
      <div className={styles.scoreBoardDeco}>
        <span className={styles.scoreText}>P1: 45</span>
        <span className={styles.vsText}>VS</span>
        <span className={styles.scoreText}>P2: 32</span>
      </div> */}

      {/* Main Landing Content */}
      <div className={styles.heroContent}>
        <div className={styles.iconContainer}>
          <svg className={styles.cricketIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2L5 11.5L8.5 15L18 5.5L14.5 2Z" fill="#64ffda" stroke="#0a192f"/>
            <path d="M5 11.5L2 19L9.5 16L5 11.5Z" fill="#233554"/>
            <circle cx="18" cy="18" r="3" fill="#ff6b6b"/>
          </svg>
        </div>
        
        <h1 className={styles.title}>HAND CRICKET</h1>
        <p className={styles.tagline}>Step onto the digital pitch. Test your luck, outsmart your opponent.</p>
        
        <div className={styles.actionContainer}>
          <button className={styles.primaryButton} onClick={handleGetStarted}>
            Enter Arena
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;