import React, { useState, useEffect } from 'react';
import styles from './home_page.module.css';
import ButtonHomePage from '../../components/button_home_page/button_home_page.jsx';
import TopMenuOptions from '../../components/top_menu_options_home_page/top_menu_options_home_page.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import UserRegisterPopup from '../../components/user_register_popup/user_register_popup.jsx';
import PlayOfflinePopup from '../../components/play_offline_popup/play_offline_popup.jsx';
import { fetchWithAuth } from '../../utils/fetchWithAuth.js';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [showOfflinePopup, setShowOfflinePopup] = useState(false);
  const [matchId, setMatchId] = useState('');

  const { userId, setUserName, userName } = useAuth();
  
  /* Retrieve the backend base URL from environment variables */
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  /* Fetch user profile data upon component mount or when userId becomes available */
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth(
  `${BACKEND_URL}/api/fetch-user`,
  {
    credentials: 'include'
  }
);
        const data = await response.json();
        console.log("Fetched User Data:", data);

        /* Check if user exists or if registration is needed */
        if (data.success && data.data) {
          setUserName(data.data.username);
          console.log(userName);
        } else if (data.success === false && data.error === 'User not found') {
          setShowRegisterPopup(true);
        }
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        /* Ensure loading state is disabled after fetch completes or fails */
        setIsDataLoading(false);
      }
    };

    fetchUserData();
  }, [userId, BACKEND_URL, setUserName]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMainMenuClick = (buttonName) => {
    console.log(`${buttonName} clicked`);
    if (buttonName === 'Play Offline') {
      setMatchId(crypto.randomUUID());
      setShowOfflinePopup(true);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Header Section */}
      <header className={styles.header}>
        <div className={styles.logo}>AutoM8 Pitch</div>
        
        <div className={styles.menuWrapper}>
          {userName && <span className={styles.greetingText}>{userName}</span>}
          <button className={styles.hamburgerBtn} onClick={toggleMenu}>
            <svg viewBox="0 0 24 24" className={styles.hamburgerIcon}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Dropdown Menu Component */}
          {isMenuOpen && <TopMenuOptions />}
        </div>
      </header>

      {/* Forced Registration Popup */}
      {showRegisterPopup && <UserRegisterPopup userId={userId} onSuccess={() => setShowRegisterPopup(false)} />}

      {/* Play Offline Share Popup */}
      {showOfflinePopup && (
        <PlayOfflinePopup 
          matchId={matchId} 
          onClose={() => setShowOfflinePopup(false)} 
        />
      )}

      {/* Main Content / Button Stack */}
      <main className={styles.mainContent}>
        {isDataLoading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Fetching Player Data...</p>
          </div>
        ) : (
          <div className={styles.buttonStack}>
            <ButtonHomePage 
              label="Play Online" 
              onClick={() => handleMainMenuClick('Play Online')} 
            />
            <ButtonHomePage 
              label="Play Offline (Local)" 
              onClick={() => handleMainMenuClick('Play Offline')} 
            />
            <ButtonHomePage 
              label="Match Rules" 
              onClick={() => handleMainMenuClick('Match Rules')} 
            />
            <ButtonHomePage 
              label="Match History" 
              onClick={() => handleMainMenuClick('Match History')} 
            />
            <ButtonHomePage 
              label="My Friends" 
              onClick={() => handleMainMenuClick('My Friends')} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;