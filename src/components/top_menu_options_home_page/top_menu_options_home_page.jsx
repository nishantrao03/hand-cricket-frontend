import React from 'react';
import styles from './top_menu_options_home_page.module.css';

const TopMenuOptions = ({ onOptionClick }) => {
  return (
    <div className={styles.menuContainer}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem} onClick={() => onOptionClick('My Profile')}>
          My Profile
        </li>
        <li className={styles.menuItem} onClick={() => onOptionClick('My Friend Requests')}>
          My Friend Requests
        </li>
        <div className={styles.divider}></div>
        <li className={`${styles.menuItem} ${styles.logoutText}`} onClick={() => onOptionClick('Logout')}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default TopMenuOptions;