import React from 'react';
import styles from './top_menu_options_home_page.module.css';

const TopMenuOptions = () => {
  const handleOptionClick = (optionName) => {
    console.log(`${optionName} clicked`);
  };

  return (
    <div className={styles.menuContainer}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem} onClick={() => handleOptionClick('My Profile')}>
          My Profile
        </li>
        <li className={styles.menuItem} onClick={() => handleOptionClick('My Friends')}>
          My Friends
        </li>
        <div className={styles.divider}></div>
        <li className={`${styles.menuItem} ${styles.logoutText}`} onClick={() => handleOptionClick('Logout')}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default TopMenuOptions;