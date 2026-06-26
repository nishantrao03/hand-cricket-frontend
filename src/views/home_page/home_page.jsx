import React, { useState, useEffect } from 'react';
import styles from './home_page.module.css';
import ButtonHomePage from '../../components/button_home_page/button_home_page.jsx';
import TopMenuOptions from '../../components/top_menu_options_home_page/top_menu_options_home_page.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import UserRegisterPopup from '../../components/user_register_popup/user_register_popup.jsx';
import PlayOfflinePopup from '../../components/play_offline_popup/play_offline_popup.jsx';
import { fetchWithAuth } from '../../utils/fetchWithAuth.js';
import { useNavigate } from 'react-router-dom';
import FriendRequestsPopup from '../../components/friend_requests_popup/friend_requests_popup.jsx';
import MyProfilePopup from '../../components/my_profile/my_profile.jsx';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [showOfflinePopup, setShowOfflinePopup] = useState(false);
  const [showFriendRequestsPopup, setShowFriendRequestsPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const [matchId, setMatchId] = useState('');

  /* Initialize the navigation hook for routing */
  const navigate = useNavigate();

  const { userId, setUserName, userName, handleLogout } = useAuth();
  
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
          setUserData(data.data);
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
        <div className={styles.logo}>Hand Cricket</div>
        
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

      {/* Forced Registration Popup */}
      {showRegisterPopup && <UserRegisterPopup userId={userId} onSuccess={() => setShowRegisterPopup(false)} />}

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
          <div className={styles.buttonStack}>
            {/* <ButtonHomePage 
              label="Play Online" 
              onClick={() => handleMainMenuClick('Play Online')} 
            /> */}
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
        )}
      </main>
    </div>
  );
};

export default HomePage;