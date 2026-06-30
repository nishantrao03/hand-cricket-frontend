import React, { useState, useEffect } from 'react';
import styles from './home_page.module.css';
import ButtonHomePage from '../../components/button_home_page/button_home_page.jsx';
import TopMenuOptions from '../../components/top_menu_options_home_page/top_menu_options_home_page.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import PlayOfflinePopup from '../../components/play_offline_popup/play_offline_popup.jsx';
import { useNavigate } from 'react-router-dom';
import FriendRequestsPopup from '../../components/friend_requests_popup/friend_requests_popup.jsx';
import MyProfilePopup from '../../components/my_profile/my_profile.jsx';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [showOfflinePopup, setShowOfflinePopup] = useState(false);
  const [showFriendRequestsPopup, setShowFriendRequestsPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const [matchId, setMatchId] = useState('');

  /* Initialize the navigation hook for routing */
  const navigate = useNavigate();

  const { userId, setUserName, userName, handleLogout, user } = useAuth();
  
  /* Monitor the context user object and update local state accordingly */
  useEffect(() => {
    if (user) {
      setUserData(user);
      // if (user.username) {
      //   setUserName(user.username);
      // }
      setIsDataLoading(false);
    } else {
      setIsDataLoading(true);
    }
  }, [user, setUserName]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /* Route user actions based on the clicked menu button */
  const handleMainMenuClick = (buttonName) => {
    console.log(`${buttonName} clicked`);
    if (buttonName === 'Play Offline') {
      setMatchId(crypto.randomUUID());
      setShowOfflinePopup(true);
    } else if (buttonName === 'Match History') {
      navigate('/matchhistory');
    } else if (buttonName === 'My Friends') {
      navigate('/friends');
    }
    else if (buttonName === 'Match Rules') {
      navigate('/matchrules');
    }
  };

  /* Handle actions from the top-right hamburger menu */
  const handleMenuOptionClick = async (optionName) => {
    setIsMenuOpen(false); // Close menu on selection
    if (optionName === 'My Friend Requests') {
      setShowFriendRequestsPopup(true);
    } else if (optionName === 'My Profile') {
      setShowProfilePopup(true);
    } else if (optionName === 'Logout') {
      await handleLogout();
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Header Section */}
      <header className={styles.header}>
        <img src="/favicon.png" alt="Hand Cricket" className={styles.logoImage} />
        
        <div className={styles.menuWrapper}>
          {userName && <span className={styles.greetingText}>{userName}</span>}
          <button className={styles.hamburgerBtn} onClick={toggleMenu}>
            <svg viewBox="0 0 24 24" className={styles.hamburgerIcon}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Dropdown Menu Component */}
          {isMenuOpen && <TopMenuOptions onOptionClick={handleMenuOptionClick} />}
        </div>
      </header>

      {/* Play Offline Share Popup */}
      {showOfflinePopup && (
        <PlayOfflinePopup 
          matchId={matchId} 
          onClose={() => setShowOfflinePopup(false)} 
        />
      )}

      {/* Friend Requests Popup */}
      {showFriendRequestsPopup && (
        <FriendRequestsPopup onClose={() => setShowFriendRequestsPopup(false)} />
      )}

      {/* My Profile Popup */}
      {showProfilePopup && userData && (
        <MyProfilePopup 
          user={userData} 
          onClose={() => setShowProfilePopup(false)} 
          onSuccess={() => {
            setShowProfilePopup(false);
            navigate(0); /* Refresh the route to force a re-fetch of user details */
          }} 
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
          <>
            {/* Hero Text Section */}
            <div className={styles.heroSection}>
              <h1 className={styles.heroTitle}>Hand Cricket</h1>
              <p className={styles.heroSubtitle}>
                {"Where Every Number Counts".split("").map((char, index) => (
                  <span 
                    key={index} 
                    className={styles.animatedChar} 
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </p>
            </div>

            <div className={styles.buttonStack}>
              <ButtonHomePage 
                label="Play A Match" 
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
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;